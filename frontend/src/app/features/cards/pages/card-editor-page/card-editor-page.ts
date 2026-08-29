import { Component, OnInit, computed, inject, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { CardsService, CardCategory } from '../../data-access/cards.service'
import { Card, UpdateCardPayload } from '../../../../shared/models/card.model'
import {
  FAVORITE_TYPES,
  FavoriteType,
  TYPE_LABELS
} from '../../../../shared/constants/favorite-types'
import { CardEditorCategoryComponent } from '../../components/card-editor-categorie/card-editor-categorie'
import { CardPreviewComponent } from '../../components/card-preview/card-preview'
import { ageFromBirthDate } from '../../../../shared/utils/age'
import { CARD_TEMPLATES, CARD_LAYOUTS } from '../../../../shared/constants/card-templates'
import { ColorFieldComponent } from '../../../../shared/components/color-field/color-field'

type Tab = 'edit' | 'preview'

@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [
    RouterLink,
    CardEditorCategoryComponent,
    CardPreviewComponent,
    ColorFieldComponent
  ],
  templateUrl: './card-editor-page.html',
  styleUrl: './card-editor-page.css'
})
export class CardEditorPage implements OnInit {
  private route = inject(ActivatedRoute)
  private cardsService = inject(CardsService)

  id = ''
  card = signal<Card | null>(null)
  categories = signal<CardCategory[]>([])

  loading = signal(true)
  error = signal('')
  saveState = signal<'idle' | 'saving' | 'saved'>('idle')
  tab = signal<Tab>('edit')

  newCategoryType = signal<FavoriteType>(FAVORITE_TYPES.MOVIE)
  avatarBusy = signal(false)

  templates = CARD_TEMPLATES
  layouts = CARD_LAYOUTS

  private saveTimeout: ReturnType<typeof setTimeout> | null = null
  private lastPayload = ''

  readonly maxCategories = 4

  availableTypes = computed(() => {
    const used = new Set(this.categories().map((c) => c.type))
    return (Object.values(FAVORITE_TYPES) as FavoriteType[]).filter(
      (t) => !used.has(t)
    )
  })

  canAddCategory = computed(
    () =>
      this.availableTypes().length > 0 &&
      this.categories().length < this.maxCategories
  )
  atCategoryLimit = computed(
    () => this.categories().length >= this.maxCategories
  )

  age = computed(() => ageFromBirthDate(this.card()?.birthDate))

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? ''
    if (!this.id) {
      this.error.set('Card no encontrada.')
      this.loading.set(false)
      return
    }

    this.cardsService.getCardById(this.id).subscribe({
      next: (data) => {
        this.card.set(data)
        this.lastPayload = JSON.stringify(this.buildPayload(data))
        this.loading.set(false)
      },
      error: () => {
        this.error.set('No se pudo cargar la card.')
        this.loading.set(false)
      }
    })

    this.loadCategories()
  }

  loadCategories() {
    this.cardsService.getCategories(this.id).subscribe({
      next: (res) => {
        this.categories.set(res)
        const avail = this.availableTypes()
        if (avail.length && !avail.includes(this.newCategoryType())) {
          this.newCategoryType.set(avail[0])
        }
      }
    })
  }

  label(type: FavoriteType) {
    return TYPE_LABELS[type]
  }

  // --- edición de campos + autosave --------------------------------------

  patch(field: keyof UpdateCardPayload, value: string) {
    const current = this.card()
    if (!current) return
    this.card.set({ ...current, [field]: value })
    this.scheduleSave()
  }

  onInput(field: keyof UpdateCardPayload, event: Event) {
    this.patch(field, (event.target as HTMLInputElement | HTMLSelectElement).value)
  }

  readonly descCharLimit = 500

  descChars(text: string | null | undefined) {
    return (text ?? '').length
  }

  private buildPayload(card: Card): UpdateCardPayload {
    return {
      name: card.name,
      handle: card.handle ?? '',
      location: card.location ?? '',
      description: card.description ?? '',
      favoriteColor: card.favoriteColor ?? undefined,
      avatarUrl: card.avatarUrl ?? undefined,
      layout: card.layout,
      template: card.template
    }
  }

  private scheduleSave() {
    const card = this.card()
    if (!card) return

    const payload = JSON.stringify(this.buildPayload(card))
    if (payload === this.lastPayload) return

    if (this.saveTimeout) clearTimeout(this.saveTimeout)
    this.saveTimeout = setTimeout(() => {
      this.lastPayload = payload
      this.saveState.set('saving')
      this.cardsService.updateCard(this.id, JSON.parse(payload)).subscribe({
        next: (updated) => {
          this.saveState.set('saved')
          setTimeout(() => this.saveState.set('idle'), 1500)
          this.card.set({ ...this.card()!, ...updated })
        },
        error: () => {
          this.saveState.set('idle')
          this.error.set('No se guardaron los últimos cambios.')
        }
      })
    }, 500)
  }

  // --- avatar ----------------------------------------------------------

  async onAvatarFile(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      this.error.set('El archivo no es una imagen.')
      return
    }

    this.avatarBusy.set(true)
    this.error.set('')
    try {
      const dataUrl = await this.resizeImage(file, 320)
      this.patch('avatarUrl', dataUrl)
    } catch {
      this.error.set('No se pudo procesar la imagen.')
    } finally {
      this.avatarBusy.set(false)
    }
  }

  removeAvatar() {
    this.patch('avatarUrl', '')
  }

  private resizeImage(file: File, max: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject()
      reader.onload = () => {
        const img = new Image()
        img.onerror = () => reject()
        img.onload = () => {
          const scale = Math.min(1, max / Math.max(img.width, img.height))
          const w = Math.round(img.width * scale)
          const h = Math.round(img.height * scale)
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          if (!ctx) return reject()
          ctx.drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL('image/jpeg', 0.85))
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  // --- categorías -----------------------------------------------------

  addCategory() {
    const type = this.newCategoryType()
    if (!this.canAddCategory() || !this.availableTypes().includes(type)) return

    this.cardsService
      .createCategory(this.id, { name: this.label(type), type })
      .subscribe({
        next: () => this.loadCategories(),
        error: (err) => {
          const msg = err?.error?.message
          this.error.set(
            err?.status === 409
              ? 'Ya tienes una categoría de ese tipo.'
              : typeof msg === 'string' && msg
                ? msg
                : 'No se pudo crear la categoría.'
          )
        }
      })
  }

  removeCategory(categoryId: string) {
    this.cardsService.deleteCategory(this.id, categoryId).subscribe({
      next: () => this.loadCategories()
    })
  }
}
