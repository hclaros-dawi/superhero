import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //para realizar peticiones HTTP(get, post...)
import { Observable } from 'rxjs'; //para manejar las respuestas asíncronas
import { HeroeInterface } from '../interfaces/heroeinterface'; //importo la interfaz

@Injectable({
  providedIn: 'root' //srvicio único y global en la aplicación
})

export class HeroeService {
  readonly urlData = 'http://localhost:3000/heroes';  //url de api héroes, solo puede ser asignada una vez en la declaración de la propiedad (no cambiará) [private, public, readonly en ts]
  constructor(readonly http: HttpClient) { } //instanciamos en el contructor httpclient para después usar get
  //se inyecta instancia de httpclient cuando se crea clase

  //método para obtener todos los héroes desde la API
  obtenerHeroes(): Observable<HeroeInterface[]> { //devuelve observable tipo array
    return this.http.get<HeroeInterface[]>(this.urlData); //realiza una solicitud GET a la url para obtener la lista de héroes
  }

  //método para capitalizar primera letra del nombre de un héroe
  capitalizarNombre(nombre: string): string {
    return nombre
      .split(' ')  //separamos las palabras por espacio
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()) //capitalizamos cada palabra
      .join(' '); //volvemos a unirlas con espacios
  }

  //método para filtrar héroes por nombre
  filtrarPorNombre(nombreHeroe: string): Observable<HeroeInterface[]> {
    const nombreMayuscula = this.capitalizarNombre(nombreHeroe.trim()); //capitalizamos la primera letra de cada palabra
    const urlFiltrada = `${this.urlData}?name=${nombreMayuscula}`;
    return this.http.get<HeroeInterface[]>(urlFiltrada);
  }

  //método para crear un nuevo héroe
  crearHeroe(heroe: HeroeInterface): Observable<HeroeInterface> { //recibe la información sobre el héroe a crear
    return this.http.post<HeroeInterface>(this.urlData, heroe); //realiza una solicitud POST para crear un héroe en la api
  }

  //método para actualizar los datos de un héroe
  actualizarHeroe(heroe: HeroeInterface): Observable<HeroeInterface> {
    return this.http.put<HeroeInterface>(`${this.urlData}/${heroe.id}`, heroe);
  }

  //método para eliminar un héroe dado su id
  eliminarHeroe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.urlData}/${id}`);
  }

}
