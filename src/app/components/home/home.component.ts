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
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';


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
    MatDialogModule,
    EditarComponent
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


  constructor(readonly heroeService: HeroeService, readonly cdr: ChangeDetectorRef, private dialog: MatDialog, private snackBar: MatSnackBar) { } //instanciamos el service para usar sus métodos

  ngOnInit(): void {
    this.cargarHeroes();
  }

  cargarHeroes(): void {
    this.heroeService.obtenerHeroes().subscribe((data: HeroeInterface[]) => {
      this.heroes = data;

      this.heroesFiltrados = [...this.heroes];

      //Vacia los héroes cargados y reiniciar la página
      this.heroesCargados = [];
      this.pagina = 0;

      // Cargar los primeros héroes
      this.cargarMas();
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
      this.heroeService.filtrarPorNombre(heroeBuscado).subscribe((heroes) => {
        this.heroesFiltrados = heroes;
      });
    }

    this.heroesCargados = [];
    this.cargarMas();
  }

  openCrearDialog(): void {
    const dialogRef = this.dialog.open(CrearComponent);

    dialogRef.afterClosed().subscribe((heroeCreado) => {
      if (heroeCreado) {
        this.cargarHeroes();
        this.cdr.markForCheck();
      }
    });
  }

  openEliminarDialog(heroe: HeroeInterface): void {
    const dialogRef = this.dialog.open(EliminarComponent, {
      data: {
        heroeId: heroe.id
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((confirmed) => {
      if (confirmed && heroe.id) {
        this.heroeService.eliminarHeroe(heroe.id).subscribe({
          next: () => {
            this.heroes = [...this.heroes.filter(h => h.id !== heroe.id)];
            this.heroesFiltrados = [...this.heroesFiltrados.filter(h => h.id !== heroe.id)];
            this.heroesCargados = [...this.heroesCargados.filter(h => h.id !== heroe.id)];

            this.cdr.markForCheck();
            this.snackBar.open('Héroe eliminado', 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.snackBar.open('Error al eliminar héroe', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  openEditarDialog(heroe: HeroeInterface): void {
    const dialogRef = this.dialog.open(EditarComponent, {
      width: '43.9375rem',
      data: { ...heroe },
    });

    dialogRef.afterClosed().subscribe((updatedHeroe) => {
      if (updatedHeroe && updatedHeroe.id) {
        // 🔥 Encuentra el héroe y actualízalo directamente en la lista
        this.heroes = this.heroes.map(h => h.id === updatedHeroe.id ? updatedHeroe : h);
        this.heroesFiltrados = this.heroesFiltrados.map(h => h.id === updatedHeroe.id ? updatedHeroe : h);
        this.heroesCargados = this.heroesCargados.map(h => h.id === updatedHeroe.id ? updatedHeroe : h);

        this.cdr.markForCheck();  
      }
    });
  }

}

