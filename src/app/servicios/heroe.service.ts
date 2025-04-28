import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeroeInterface } from '../models/heroeinterface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class HeroeService {
  readonly urlData = 'http://localhost:3000/heroes';
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar)

  public getHeroes(): Observable<HeroeInterface[]> {
    return this.http.get<HeroeInterface[]>(this.urlData);
  }

  public filterByName(heroName: string): Observable<HeroeInterface[]> {
    const params = new HttpParams().set('name', heroName);
    return this.http.get<HeroeInterface[]>(this.urlData, { params });
  }

  public createHero(hero: HeroeInterface): Observable<HeroeInterface> {
    return this.http.post<HeroeInterface>(this.urlData, hero);
  }

  public updateHero(hero: HeroeInterface): Observable<HeroeInterface> {
    return this.http.put<HeroeInterface>(`${this.urlData}/${hero.id}`, hero);
  }

  public deleteHero(id: string): Observable<void> {
    return this.http.delete<void>(`${this.urlData}/${id}`);
  }
}
