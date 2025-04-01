import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //para realizar peticiones HTTP(get, post...)
import { Observable } from 'rxjs';
import { HeroeInterface } from '../interfaces/heroeinterface'; //importo la interfaz

@Injectable({
  providedIn: 'root' //srvicio único y global en la aplicación
})
export class HeroeService {
  readonly urlData = 'http://localhost:3000/heroes';  //url de api héroes, solo puede ser asignada una vez en la declaración de la propiedad (no cambiará) [private, public, readonly en ts]
  constructor(readonly http: HttpClient) { } //instanciamos en el contructor httpclient para después usar get
  //se inyecta instancia de httpclient cuando se crea clase

  obtenerHeroes(): Observable<HeroeInterface[]> {
    return this.http.get<HeroeInterface[]>(this.urlData); //Devuelve una lista de héroes
  }

  capitalizarNombre(nombre: string): string {
    return nombre
      .split(' ')  // Separamos las palabras por espacio
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()) // Capitalizamos cada palabra
      .join(' '); // Volvemos a unirlas con espacios
  }

  filtrarPorNombre(nombreHeroe: string): Observable<HeroeInterface[]> {
    const nombreMayuscula = this.capitalizarNombre(nombreHeroe.trim()); //Capitalizamos la primera letra de cada palabra
    const urlFiltrada = `${this.urlData}?name=${nombreMayuscula}`; // Usamos 'name_like' para que sea flexible
    return this.http.get<HeroeInterface[]>(urlFiltrada);
  }

  crearHeroe(heroe: HeroeInterface): Observable<HeroeInterface> {
    return this.http.post<HeroeInterface>(this.urlData, heroe);
  }
  actualizarHeroe(heroe: HeroeInterface): Observable<HeroeInterface> {
    return this.http.put<HeroeInterface>(`${this.urlData}/${heroe.id}`, heroe);
  }

  eliminarHeroe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.urlData}/${id}`);
  }

}
