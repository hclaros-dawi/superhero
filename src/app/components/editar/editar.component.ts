import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HeroeInterface } from '../../interfaces/heroeinterface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeroeService } from '../../servicios/heroe.service';
import { take } from 'rxjs/operators';

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
    id: '',
    name: '',
    poderes: '',
    lugar: '',
    descripcion: '',
    imagen: null
  };

  fileName: string = "";

  constructor(private cdRef: ChangeDetectorRef, private heroeService: HeroeService, public dialogRef: MatDialogRef<EditarComponent>, @Inject(MAT_DIALOG_DATA) public data: HeroeInterface) { }

  ngOnInit(): void {
    if (this.data) {
      this.heroes = { ...this.data }; //carga los datos del héroe para editar
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
    const heroeActualizado: HeroeInterface = {
      id: this.heroes.id,
      name: this.heroes.name,
      poderes: this.heroes.poderes,
      lugar: this.heroes.lugar,
      descripcion: this.heroes.descripcion,
      imagen: this.heroes.imagen
    };

    this.heroeService.actualizarHeroe(heroeActualizado).pipe(
      take(1)
    ).subscribe({
      next: (actualizado) => {
        this.dialogRef.close(actualizado);
      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  }

  cerrarDialogo(): void {
    this.dialogRef.close();
  }
}

