import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeroeService } from '../../servicios/heroe.service';
import { HeroeInterface } from '../../interfaces/heroeinterface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FooterComponent } from '../footer/footer.component';
import { CrearComponent } from "../crear/crear.component";
import { EliminarComponent } from "../eliminar/eliminar.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditarComponent } from '../editar/editar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
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
export class HomeComponent implements OnInit { //inicialización de datos de proyecto en general

  heroes: HeroeInterface[] = [];  //define heroes como un array de tipo HeroeInterface que almacenará héroes obtenidos desde el servicio
  heroesFiltrados: HeroeInterface[] = [];  //define array para almacenar héroes filtrados
  heroeBuscado: string = '';
  heroesCargados: HeroeInterface[] = [];
  pagina: number = 0;  //indica la página actual
  maxPag: number = 8;  //número máximo de héroes que se cargarán por cada página
  heroesEliminados: number[] = [];
  loading: boolean = false;  //indicador de carga. Se establece en 'true' cuando los héroes están siendo cargados y se muestra un spinner de carga

  constructor(readonly heroeService: HeroeService, readonly cdr: ChangeDetectorRef, private dialog: MatDialog, private snackBar: MatSnackBar) { } //instanciamos el service para usar sus métodos

  ngOnInit(): void {
    this.loading = true; //establece loading cuando empieza carga
    setTimeout(() => {
      this.cargarHeroes();
      this.loading = false;
    }, 1200)
  }

  cargarHeroes(): void {
    this.heroeService.obtenerHeroes().subscribe({ //se suscribe al observable de función servicio hace petición a backend
      next: (data: HeroeInterface[]) => { //si suscripción exitosa, back le devuelve respuesta como array
        this.heroes = data; //asigna datos recibidos (data) a propiedad de heroes
        this.heroesFiltrados = [...this.heroes]; //copia o duplica array de heroes a heroesFiltrados para que lo pueda usar después
        this.heroesCargados = []; //reinicia heroesCargados a un array vacío, ya que se recibe nueva lista de héroes
        this.pagina = 0; //reinicia la página
        this.cargarMas(); //para cargar el primer bloque de héroes
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
    //si no hay héroes para cargar, no hacemos nada
    if (this.pagina * this.maxPag >= this.heroesFiltrados.length) {
      // si el número de héroes que hemos cargado ya es igual o mayor que el número total de héroes filtrados, no hacemos nada
      return;
    }

    //calcular inicio y fin segun pag actual y num max de heroes por página
    const inicio = this.pagina * this.maxPag; //índice de inicio de los héroes a cargar
    const final = inicio + this.maxPag; //índice final de los héroes a cargar

    const heroesPorCargar = this.heroesFiltrados.slice(inicio, final); //slice para extraer una porción del heroesFiltrados sin modificar la original

    this.heroesCargados = [...this.heroesCargados, ...heroesPorCargar]; //copia los heroes ya cargados en pantalla y los nuevos por cargar (array)

    //Incrementar la página para la siguiente carga
    this.pagina++;

    this.cdr.detectChanges();
  }


  filtrarPorNombre(heroeBuscado: string) {
    this.pagina = 0; //reinicia la página a 0 cada vez que se hace una nueva búsqueda
    if (!heroeBuscado.trim()) { //si valor está vacío o solo contiene espacios en blanco
      //si no se ha escrito nada en el campo de búsqueda, mostramos todos los héroes
      this.heroesFiltrados = this.heroes; //asigna todos los heroes a heroesFiltrados
    } else {
      this.heroeService.filtrarPorNombre(heroeBuscado).subscribe((heroes) => {
        this.heroesFiltrados = heroes; //la respuesta del back la asignamos a heroesFiltrados
      });
    }

    this.heroesCargados = []; //cuando hago un nuevo filtrado, todos los héroes previamente cargados se eliminan de la lista
    this.cargarMas(); //se llama para cargar los primeros héroes (bloque) que coincidan con el filtro
  }

  openCrearDialog(): void {
    const dialogRef = this.dialog.open(CrearComponent); //abrir el componente en un diálogo

    //afterclosed()--> método que devuelve observable y al que me suscribo
    //heroeCreado es el observable que me pasan en guardarHeroes de crearComponent al cerrar diálogo
    dialogRef.afterClosed().subscribe((heroeCreado) => {
      if (heroeCreado) {
        this.snackBar.open('Héroe creado con éxito', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['exito-snackbar']
        });

        this.cargarHeroes(); //recarga lista con nuevo héroe

        this.cdr.detectChanges();

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
    const dialogRef = this.dialog.open(EliminarComponent); //abrir el componente en un diálogo

    //afterclosed()--> método que devuelve observable y al que me suscribo
    //confirmado (booleano) es el observable que me pasan en eliminarComponent al cerrar diálogo
    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado && heroe.id) { //si usuario confirma e id válido
        this.heroeService.eliminarHeroe(heroe.id).subscribe({ //se suscribe al observable de función servicio hace petición a backend (le envía id de héroe)
          next: () => { //se ejecuta si eliminación exitosa
            //Actualiza lista de héroes
            this.heroes = [...this.heroes.filter(h => h.id !== heroe.id)]; //copia de array de héroes que filtra heroes con id diferente al eliminado
            this.heroesFiltrados = [...this.heroesFiltrados.filter(h => h.id !== heroe.id)]; //copia de array de héroes f. con id diferente al eliminado
            this.heroesCargados = [...this.heroesCargados.filter(h => h.id !== heroe.id)]; //copia de array de héroes c. con id diferente al eliminado

            this.cdr.detectChanges();

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
    const dialogRef = this.dialog.open(EditarComponent, { //abrir el componente en un diálogo
      data: { ...heroe } //le pasa los datos de los heroes para que pueda editarlos (MAT_DIALOG_DATA) a editarComponent
    });

    //afterclosed()--> método que devuelve observable y al que me suscribo
    //heroeActualizado es el observable que me pasan en editarComponent al cerrar diálogo
    dialogRef.afterClosed().subscribe((heroeActualizado) => {
      if (heroeActualizado && heroeActualizado.id) { //si heroeActulizado e id válidos
        //a héroes se asigna una copia de array heroes que se recorre con map y va verificando su id de heroe es igual a la del actualizado--> T (se reenplaza con hActual)
        //F--> (se deja héroe tal cual está)
        //lo mismo para el resto
        this.heroes = this.heroes.map(h => h.id === heroeActualizado.id ? heroeActualizado : h);
        this.heroesFiltrados = this.heroesFiltrados.map(h => h.id === heroeActualizado.id ? heroeActualizado : h);
        this.heroesCargados = this.heroesCargados.map(h => h.id === heroeActualizado.id ? heroeActualizado : h);

        this.cdr.detectChanges();

        this.snackBar.open('Héroe modificado con éxito', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['exito-snackbar']
        });
      } else if (heroeActualizado === false) {
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

