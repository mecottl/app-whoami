// src/app/features/cards/pages/card-editor-page/card-editor-page.ts

import { Component, OnInit, output, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CardsService } from '../../data-access/cards.service'
import { FAVORITE_TYPES, FavoriteType } from '../../../../shared/constants/favorite-types'
import { CardEditorCategoryComponent } from '../../components/card-editor-categorie/card-editor-categorie'
import { CardPreviewComponent } from '../../components/card-preview/card-preview'

@Component({
  selector: 'app-card-editor',
  standalone: true,
  imports: [CardEditorCategoryComponent, CardPreviewComponent],
  templateUrl: './card-editor-page.html'
})
export class CardEditorPage implements OnInit {
  id: string | null = null

  card = signal<any>(null)
  loading = signal(true)

  categories = signal<any[]>([])
  selectedCategoryType = signal<FavoriteType>(FAVORITE_TYPES.MOVIE)

  favoriteTypes = Object.values(FAVORITE_TYPES)
  saving = signal(false)
  private saveTimeout: any = null
  private lastPayload = ''

  constructor(
    private route: ActivatedRoute,
    private cardsService: CardsService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')
    if (!this.id) return

    this.cardsService.getCardById(this.id).subscribe({
      next: (data) => {
        this.card.set(data)
        this.loading.set(false)
      }
    })

    this.loadCategories()
  }

  loadCategories() {
    if (!this.id) return

    this.cardsService.getCategories(this.id).subscribe({
      next: (res) => this.categories.set(res)
    })
  }

  addCategory() {
    if (!this.id) return

    const type = this.selectedCategoryType()

    this.cardsService.createCategory(this.id, {
      name: type,
      type
    }).subscribe({
      next: () => this.loadCategories()
    })
  }

  removeCategory(categoryId: string) {
    if (!this.id) return

    this.cardsService.deleteCategory(this.id, categoryId).subscribe({
      next: () => this.loadCategories()
    })
  }

  updateField(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value

    this.card.set({
      ...this.card(),
      [field]: value
    })
    this.triggerAutoSave()
  }

  private getPayload() {
  const { name, description, favoriteColor, layout, template } = this.card()

  return { name, description, favoriteColor, layout, template }
}

private triggerAutoSave() {
  if (!this.id) return

  const payload = JSON.stringify(this.getPayload())

  if (payload === this.lastPayload) return
  this.lastPayload = payload

  if (this.saveTimeout) clearTimeout(this.saveTimeout)

  this.saveTimeout = setTimeout(() => {
    this.saving.set(true)

    this.cardsService.updateCard(this.id!, JSON.parse(payload)).subscribe({
      next: () => this.saving.set(false),
      error: () => this.saving.set(false)
    })
  }, 600)
}

  save() {
    if (!this.id || !this.card()) return

    this.cardsService.updateCard(this.id, this.card()).subscribe({
      next: (res) => {
        this.card.set(res)
      }
    })
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value
    this.selectedCategoryType.set(value as any)
  }
}