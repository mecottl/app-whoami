import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import type { SearchResult } from '../search-result.js'

@Injectable()
export class SportsDbProvider {
  // "3" es la key pública de pruebas de TheSportsDB (suficiente para el MVP).
  private apiKey = process.env.SPORTSDB_API_KEY || '3'

  constructor(private http: HttpService) {}

  async search(query: string): Promise<SearchResult[]> {
    const url = `https://www.thesportsdb.com/api/v1/json/${this.apiKey}/searchteams.php?t=${encodeURIComponent(query)}`
    const res = await firstValueFrom(this.http.get(url))

    return (res.data.teams ?? []).slice(0, 8).map((t: any) => ({
      id: t.idTeam?.toString() ?? t.strTeam,
      title: t.strTeam,
      imageUrl: t.strBadge ?? t.strTeamBadge ?? null,
    }))
  }
}
