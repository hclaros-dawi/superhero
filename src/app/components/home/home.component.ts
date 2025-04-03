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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


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
    EditarComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  heroes: HeroeInterface[] = []; //Define la propiedad de héroes como array de HeroeInterface
  heroesFiltrados: HeroeInterface[] = [];  //Por defecto muestra todos los héroes
  heroeBuscado: string = '';
  heroesCargados: HeroeInterface[] = [];
  pagina: number = 0;
  maxPag: number = 8;
  heroesEliminados: number[] = [];
  loading: boolean = false;


  constructor(readonly heroeService: HeroeService, readonly cdr: ChangeDetectorRef, private dialog: MatDialog, private snackBar: MatSnackBar) { } //instanciamos el service para usar sus métodos

  ngOnInit(): void {

    this.loading = true; //establece loading cuando empieza carga
    setTimeout(() => {
      this.cargarHeroes();
      this.loading = false;
    }, 1200)
  }

  cargarHeroes(): void {
    this.heroeService.obtenerHeroes().subscribe({
      next: (data: HeroeInterface[]) => {
        this.heroes = data;
        this.heroesFiltrados = [...this.heroes];
        this.heroesCargados = [];
        this.pagina = 0;
        this.cargarMas();
      },
      error: () => {
        this.snackBar.open('Ha ocurrido un error', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  cargarMas(): void {
    //Si no hay héroes para cargar, no hacemos nada
    if (this.pagina * this.maxPag >= this.heroesFiltrados.length) {
      return;
    }

    //calcular inicio y fin segun pag actual y num max de heroes por página
    const inicio = this.pagina * this.maxPag;
    const final = inicio + this.maxPag;

    const heroesPorCargar = this.heroesFiltrados.slice(inicio, final);

    this.heroesCargados = [...this.heroesCargados, ...heroesPorCargar];

    //Incrementar la página para la siguiente carga
    this.pagina++;

    this.cdr.detectChanges();
  }


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
        this.snackBar.open('Héroe creado con éxito', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['exito-snackbar']
        });
        this.cargarHeroes();
        this.cdr.markForCheck();
      } else if (heroeCreado === false) {
        this.snackBar.open('Ha ocurrido un error', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openEliminarDialog(heroe: HeroeInterface): void {
    const dialogRef = this.dialog.open(EliminarComponent, {
      data: {
        heroeId: heroe.id
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((confirmed) => { //escucha cierre de dialogo en componente hijp
      if (confirmed && heroe.id) {
        this.heroeService.eliminarHeroe(heroe.id).subscribe({
          next: () => {
            this.heroes = [...this.heroes.filter(h => h.id !== heroe.id)];
            this.heroesFiltrados = [...this.heroesFiltrados.filter(h => h.id !== heroe.id)];
            this.heroesCargados = [...this.heroesCargados.filter(h => h.id !== heroe.id)];

            this.cdr.markForCheck();
            this.snackBar.open('Este héroe se ha eliminado', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['exito-snackbar']
            });
          },
          error: (err) => {
            this.snackBar.open('Ha ocurrido un error', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  openEditarDialog(heroe: HeroeInterface): void {
    const dialogRef = this.dialog.open(EditarComponent, {
      width: '43.9375rem',
      data: { ...heroe }, //le pasa los datos de los heroes para que pueda editarlos (MAT_DIALOG_DATA)
    });

    dialogRef.afterClosed().subscribe((updatedHeroe) => {
      if (updatedHeroe && updatedHeroe.id) {
         this.heroes = this.heroes.map(h => h.id === updatedHeroe.id ? updatedHeroe : h);
        this.heroesFiltrados = this.heroesFiltrados.map(h => h.id === updatedHeroe.id ? updatedHeroe : h);
        this.heroesCargados = this.heroesCargados.map(h => h.id === updatedHeroe.id ? updatedHeroe : h);
        this.cdr.markForCheck();

        this.snackBar.open('Héroe modificado con éxito', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['exito-snackbar']
        });
      } else if (updatedHeroe === false) {
         this.snackBar.open('Error al actualizar héroe', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

}

