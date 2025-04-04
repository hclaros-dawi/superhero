import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HeroeInterface } from '../../interfaces/heroeinterface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeroeService } from '../../servicios/heroe.service';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EditarComponent implements OnInit { //necesita onInit porque necesita cargar datos previos del héroe para editarlo

  heroes: HeroeInterface = {
    id: '', //no se omite ya que es el identificador del héroe a editar (ya creado por defecto)
    name: '',
    poderes: '',
    lugar: '',
    descripcion: '',
    imagen: null
  };

  fileName: string = "";

  constructor(private cdRef: ChangeDetectorRef, private heroeService: HeroeService, public dialogRef: MatDialogRef<EditarComponent>, @Inject(MAT_DIALOG_DATA) public data: HeroeInterface) { }

  ngOnInit(): void {
    if (this.data) { //si hay datos previos del héroe para cargar
      //con spread operator, copiamos objeto data a heroes, inicializamos héroes
      this.heroes = { ...this.data }; //carga los datos del héroe para editar con mat dialog data
    }
  }

  seleccionarArchivo() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  manejarArchivo(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.heroes.imagen = e.target.result; //convertir imagen a base64
      };
      reader.readAsDataURL(file);
    } else {
      this.fileName = "No hay archivo seleccionado";
    }
  }

  guardarNuevoHeroe(): void {
    //crea objeto heroeActualizado de tipo HeroInterface que contiene datos inicializados (que se han copiado de data)
    const heroeActualizado: HeroeInterface = {
      id: this.heroes.id,
      name: this.heroes.name,
      poderes: this.heroes.poderes,
      lugar: this.heroes.lugar,
      descripcion: this.heroes.descripcion,
      imagen: this.heroes.imagen
    };

    //se suscribe al observable de función servicio hace petición a backend (le envía heroesActualizados)
    this.heroeService.actualizarHeroe(heroeActualizado).subscribe({
      next: (actualizado) => { //si suscripción exitosa, back le devuelve respuesta (actualizado)
        this.dialogRef.close(actualizado); //next se ejecuta, cierra diálogo y envía actualizado a componente que abre diálogo (home)
      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  }

  cerrarDialogo(): void {
    this.dialogRef.close();
  }
}

