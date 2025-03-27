import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeroeService } from '../../servicios/heroe.service'; //Importo los servicios en el componente principal
import { HeroeInterface } from '../../interfaces/heroeinterface'; //importo la interfaz
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';  // Importar el módulo MatFormFieldModule
import { FooterComponent } from '../footer/footer.component';
import { CrearComponent } from "../crear/crear.component"; // Ajusta la ruta según la ubicación de tu footer

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    FooterComponent,
    CrearComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  heroes: HeroeInterface[] = []; //Define la propiedad de héroes como array de HeroeInterface
  heroesFiltrados: HeroeInterface[] = [];  // Por defecto muestra todos los héroes
  heroeBuscado: string = '';
  heroesCargados: HeroeInterface[] = [];
  pagina: number = 0;
  maxPag: number = 4;

  constructor(readonly heroeservice: HeroeService, readonly cdr: ChangeDetectorRef) { } //instanciamos el service para usar sus métodos

  ngOnInit(): void {
    this.cargarHeroes();
  }

  cargarHeroes(): void {
    this.heroeservice.obtenerHeroes().subscribe(
      (data: HeroeInterface[]) => {
        this.heroes = data;
        this.heroesFiltrados = data;
        this.pagina = 0; //reiniciar la página cada vez que se carga
        this.heroesCargados = [];
        this.cargarMas();
        this.cdr.detectChanges();
      }
    );
  }

  cargarMas(): void {

    // Si no hay héroes para cargar, no hacemos nada
    if (this.pagina * this.maxPag >= this.heroesFiltrados.length) {
      return;
    }
    //calcular inicio y fin segun pag actual y num max de heroes por página
    const inicio = this.pagina * this.maxPag;
    const final = inicio + this.maxPag;

    const heroesPorCargar = this.heroesFiltrados.slice(inicio, final);

    this.heroesCargados = [...this.heroesCargados, ...heroesPorCargar];

    //Incrementa la página para la siguiente carfa
    this.pagina++;
    this.cdr.detectChanges();
  }

  //Llamo al servicio para buscar héroes por nombre
  filtrarPorNombre(heroeBuscado: string) {
    this.pagina = 0;
    if (!heroeBuscado.trim()) {
      // Si no se ha escrito nada en el campo de búsqueda, mostramos todos los héroes
      this.heroesFiltrados = this.heroes;
    } else {
      this.heroeservice.filtrarPorNombre(heroeBuscado).subscribe((heroes) => {
        this.heroesFiltrados = heroes;
      });
    }

    this.heroesCargados = [];
    this.cargarMas(); // Cargar los primeros 4 héroes filtrados
  }
}
