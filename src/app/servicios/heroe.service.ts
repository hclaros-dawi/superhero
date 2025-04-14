import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeroeInterface } from '../interfaces/heroeinterface';

@Injectable({
  providedIn: 'root'
})

export class HeroeService {
  readonly urlData = 'http://localhost:3000/heroes';
  private readonly http = inject(HttpClient);

  getHeroes(): Observable<HeroeInterface[]> {
    return this.http.get<HeroeInterface[]>(this.urlData);
  }

  capitalizeName(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  filterByName(heroName: string): Observable<HeroeInterface[]> {
    const capitalizedName = this.capitalizeName(heroName.trim());
    const filteredUrl = `${this.urlData}?name=${capitalizedName}`;
    return this.http.get<HeroeInterface[]>(filteredUrl);
  }

  createHero(hero: HeroeInterface): Observable<HeroeInterface> {
    return this.http.post<HeroeInterface>(this.urlData, hero);
  }

  updateHero(hero: HeroeInterface): Observable<HeroeInterface> {
    return this.http.put<HeroeInterface>(`${this.urlData}/${hero.id}`, hero);
  }

  deleteHero(id: string): Observable<void> {
    return this.http.delete<void>(`${this.urlData}/${id}`);
  }
}
