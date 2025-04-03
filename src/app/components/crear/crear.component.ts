import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HeroeInterface } from '../../interfaces/heroeinterface'; //importo la interfaz
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'; //para gestionar diálogos
import { MatInputModule } from '@angular/material/input';
import { HeroeService } from '../../servicios/heroe.service';

@Component({
  selector: 'app-crear',
  standalone: true, //funciona sin necesidad de NgModule
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule, MatDialogModule, MatInputModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CrearComponent { //no necesita onInit porque parte de un objeto vacío, nada que cargar

  heroes: Omit<HeroeInterface, 'id'> = { //se omite id para que se cree por defecto
    name: '',
    poderes: '',
    lugar: '',
    descripcion: '',
    imagen: null
  };

  constructor(private cdRef: ChangeDetectorRef, private heroeService: HeroeService, private dialogRef: MatDialogRef<CrearComponent>) { }

  fileName: string = ""; //almacena nombre archivo seleccionado
  terminosAceptados: boolean = false; //si ususario ha aceptado condiciones o no

  //getter (propiedad dinámica) para aceptar la creación de héroes si campos son válidos
  get formularioEsValido(): boolean {
    return (
      this.heroes.name.trim() !== '' && //nombre héroe no vacío después de eliminar espacios al principio y final
      this.heroes.poderes.trim() !== '' &&
      this.heroes.lugar.trim() !== '' &&
      this.heroes.descripcion.trim() !== '' &&
      this.heroes.imagen !== null &&
      this.terminosAceptados //usuario acepta (true)
    );
  }

  seleccionarArchivo() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement; //porque sin as... devuelve HTMLElement, hay que especificar input
    //para que así aplique click y abra explorador de archivos
    fileInput.click();
  }

  manejarArchivo(event: any) { //el event es la información del archivo seleccionado que se pasa después recibe en la vista para el nombre
    const file: File = event.target.files[0]; //declara archivo tipo File y asigna elemento que desencadena evento, primera posición
    if (file) {
      this.fileName = file.name;

      const reader = new FileReader(); //declara objeto fr para leer archivos
      reader.onload = (e: any) => { //se ejecuta al acabar de leer archivo
        this.heroes.imagen = e.target.result;
      };
      reader.readAsDataURL(file); //lee el archivo y devuelve url, convierte datos a b64
    } else {
      this.fileName = "No hay archivo seleccionado";
    }
  }

  guardarHeroe() {
    if (!this.formularioEsValido) return; //si es falso, acaba y no se ejecuta lo de a continuación

    this.heroeService.crearHeroe(this.heroes).subscribe({ //se suscribe al observable de función servicio hace petición a backend (le envía heroes)
      next: (heroeCreado) => { //si suscripción exitosa, back le devuelve respuesta (heroeCreado)
        this.dialogRef.close(heroeCreado); //next se ejecuta, cierra diálogo y envía heroCreado a componente que abre diálogo
      },
      error: (err) => {
        console.error('Error al crear héroe:', err);
      }
    });
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }

}


