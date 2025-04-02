import { ChangeDetectionStrategy, Component, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms'
import { HeroeInterface } from '../../interfaces/heroeinterface'; //importo la interfaz
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { HeroeService } from '../../servicios/heroe.service';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule, MatDialogModule, MatInputModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CrearComponent {
  @Output() heroeCreado = new EventEmitter<HeroeInterface>();

   heroes: Omit<HeroeInterface, 'id'> = {
    name: '',
    poderes: '',
    lugar: '',
    descripcion: '',
    imagen: null
  };

  constructor(private cdRef: ChangeDetectorRef, private heroeService: HeroeService, private dialogRef: MatDialogRef<CrearComponent>) { }

  fileName: string = "";
  terminosAceptados: boolean = false;

  get formularioEsValido(): boolean {
    return (
      this.heroes.name.trim() !== '' &&
      this.heroes.poderes.trim() !== '' &&
      this.heroes.lugar.trim() !== '' &&
      this.heroes.descripcion.trim() !== '' &&
      this.heroes.imagen !== null &&
      this.terminosAceptados
    );
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
        this.heroes.imagen = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.fileName = "No hay archivo seleccionado";
    }
  }

  guardarHeroe() {
    if (!this.formularioEsValido) return;

    this.heroeService.crearHeroe(this.heroes).subscribe({
      next: (heroeCreado) => {
         this.dialogRef.close(heroeCreado);
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


