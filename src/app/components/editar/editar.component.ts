import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, EventEmitter, Output, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HeroeInterface } from '../../interfaces/heroeinterface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Importar para el control del diálogo
import { HeroeService } from '../../servicios/heroe.service';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditarComponent implements OnInit {
  @Output() nuevoHeroe = new EventEmitter<HeroeInterface>();

  heroes: HeroeInterface = {
    id: 0,
    name: '',
    poderes: '',
    lugar: '',
    descripcion: '',
    imagen: null
  };

  fileName: string = "";

  constructor(
    private cdRef: ChangeDetectorRef,
    private heroeService: HeroeService,
    public dialogRef: MatDialogRef<EditarComponent>, // Usamos MatDialogRef para cerrar el diálogo
    @Inject(MAT_DIALOG_DATA) public data: HeroeInterface // Recibir datos del héroe
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.heroes = { ...this.data };  // Cargar los datos del héroe para editar
    }
  }

  seleccionarArchivo() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.heroes.imagen = e.target.result;  // Convertir imagen a base64
      };
      reader.readAsDataURL(file);
    } else {
      this.fileName = "No hay archivo seleccionado";
    }
  }

  // Método para guardar los cambios
  guardarDatos(): void {
    const nuevoHeroe: HeroeInterface = {
      id: this.heroes.id,  // Mantener el ID existente del héroe
      name: this.heroes.name,
      poderes: this.heroes.poderes,
      lugar: this.heroes.lugar,
      descripcion: this.heroes.descripcion,
      imagen: this.heroes.imagen
    };

    console.log('Héroe actualizado:', nuevoHeroe);
    // Usar el servicio para actualizar el héroe en el backend
    this.heroeService.crearHeroe(nuevoHeroe).subscribe(
      (creado) => {
        console.log('Héroe creado en el backend:', creado);
        this.nuevoHeroe.emit(creado);  // Emitir el héroe creado
        this.dialogRef.close(creado);  // Cerrar el diálogo después de guardar los cambios
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error al crear héroe:', error);
      }
    );
  }

  // Método para cerrar el diálogo
  cerrarDialogo(): void {
    this.dialogRef.close();  // Cerrar el diálogo usando MatDialogRef
  }
}
