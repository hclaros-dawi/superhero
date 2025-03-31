import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeroeService } from '../../servicios/heroe.service';
import { HeroeInterface } from '../../interfaces/heroeinterface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FooterComponent } from '../footer/footer.component';
import { CrearComponent } from "../crear/crear.component";
import { EliminarComponent } from "../eliminar/eliminar.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditarComponent } from '../editar/editar.component';

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
    CrearComponent,
    EliminarComponent,
    EditarComponent,
    MatDialogModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  heroes: HeroeInterface[] = []; //Define la propiedad de héroes como array de HeroeInterface
  heroesFiltrados: HeroeInterface[] = [];  // Por defecto muestra todos los héroes
  heroeBuscado: string = '';
  heroesCargados: HeroeInterface[] = [];
  pagina: number = 0;
  maxPag: number = 8;
  heroesEliminados: number[] = [];


  constructor(readonly heroeservice: HeroeService, readonly cdr: ChangeDetectorRef, private dialog: MatDialog) { } //instanciamos el service para usar sus métodos

  ngOnInit(): void {
    // Recuperar héroes eliminados desde localStorage
    const eliminadosGuardados = localStorage.getItem('heroesEliminados');
    if (eliminadosGuardados) {
      this.heroesEliminados = JSON.parse(eliminadosGuardados);
    }

    this.cargarHeroes();
  }

  cargarHeroes(): void {
    this.heroeservice.obtenerHeroes().subscribe((data: HeroeInterface[]) => {
      // Filtrar los héroes eliminados antes de mostrarlos
      this.heroes = data.filter(heroe => !this.heroesEliminados.includes(heroe.id));
      this.heroesFiltrados = [...this.heroes];
      this.pagina = 0;
      this.heroesCargados = [];
      this.cargarMas();
      this.cdr.detectChanges();
    });
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
    this.cargarMas();
  }

  openEliminarDialog(heroe: HeroeInterface): void {
    console.log("Intentando eliminar héroe:", heroe);
    const dialogRef = this.dialog.open(EliminarComponent, {
      width: '43.9375rem',
      data: heroe, // Pasa el héroe a eliminar al cuadro de diálogo
    });

    // Cuando el diálogo se cierra, revisamos si la eliminación fue confirmada
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminarHeroe(heroe.id); // Si se confirma la eliminación, eliminamos el héroe
      }
    });
  }

  // Método para eliminar héroe permanentemente
  eliminarHeroe(id: number): void {
    console.log("Intentando eliminar el héroe con ID:", id);

    // Agregar ID a la lista de eliminados y guardar en localStorage
    this.heroesEliminados.push(id);
    localStorage.setItem('heroesEliminados', JSON.stringify(this.heroesEliminados));

    // Filtrar los héroes en la UI
    this.heroes = this.heroes.filter(heroe => heroe.id !== id);
    this.heroesFiltrados = this.heroesFiltrados.filter(heroe => heroe.id !== id);
    this.heroesCargados = this.heroesCargados.filter(heroe => heroe.id !== id);

    this.cdr.detectChanges();
  }


  crearHeroe(nuevoHeroe: HeroeInterface) {
    console.log('Héroe recibido en el padre:', nuevoHeroe); //Verifica si el héroe se recibe correctamente
    this.heroes.push(nuevoHeroe);
    this.heroesCargados = [...this.heroesCargados, nuevoHeroe]; //Agregarlo a la vista también
    this.cdr.detectChanges();
  }

  openEditarDialog(heroe: HeroeInterface): void {
    const dialogRef = this.dialog.open(EditarComponent, {
      width: '43.9375rem',
      data: { ...heroe }, // Pasa el héroe al cuadro de diálogo
    });

    dialogRef.afterClosed().subscribe((updatedHeroe) => {
      if (updatedHeroe) {
        // Llama al servicio para actualizar en el backend
        this.heroeservice.actualizarHeroe(updatedHeroe).subscribe(
          (response) => {
            console.log('Héroe actualizado correctamente:', response);

            // Reemplazar el héroe actualizado en los arrays sin duplicarlo
            this.heroes = this.heroes.map(h => h.id === response.id ? response : h);
            this.heroesFiltrados = this.heroesFiltrados.map(h => h.id === response.id ? response : h);
            this.heroesCargados = this.heroesCargados.map(h => h.id === response.id ? response : h);

            this.heroes = [...this.heroes];
            this.heroesFiltrados = [...this.heroesFiltrados];
            this.heroesCargados = [...this.heroesCargados];

            // **Forzar actualización inmediata en la vista**
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Error al actualizar héroe:', error);
          }
        );
      }
    });
  }


}

