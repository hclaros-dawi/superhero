import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms'
import { HeroeInterface } from '../../interfaces/heroeinterface'; //importo la interfaz
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { HeroeService } from '../../servicios/heroe.service'

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule, MatDialogModule, MatInputModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CrearComponent implements OnInit {
  @Output() nuevoHeroe = new EventEmitter<HeroeInterface>();

  displayDialog = false;

  heroes: HeroeInterface = {
    id: 0,
    name: '',
    poderes: '',
    lugar: '',
    descripcion: '',
    imagen: null
  };

  constructor(private cdRef: ChangeDetectorRef, private heroeService: HeroeService) { }

  ngOnInit(): void { }

  abrirDialogo(): void {
    this.displayDialog = true;
    this.cdRef.detectChanges();
  }

  cerrarDialogo(): void {
    this.displayDialog = false;
    this.cdRef.detectChanges();
  }

  fileName: string = "";

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
        this.heroes.imagen = e.target.result;  //Convertir imagen a base64
      };
      reader.readAsDataURL(file);
    } else {
      this.fileName = "No hay archivo seleccionado";
    }
  }

  guardarDatos(): void {
    const nuevoHeroe: HeroeInterface = {
      id: Math.floor(Math.random() * 1000000),
      name: this.heroes.name,
      poderes: this.heroes.poderes,
      lugar: this.heroes.lugar,
      descripcion: this.heroes.descripcion,
      imagen: this.heroes.imagen
    };

    console.log('Nuevo héroe creado:', nuevoHeroe); // Verifica si el héroe es creado correctamente
    // Utiliza el servicio para enviar el nuevo héroe al backend
    this.heroeService.crearHeroe(nuevoHeroe).subscribe(
      (creado) => {
        console.log('Héroe creado en el backend:', creado);
        this.nuevoHeroe.emit(creado);  // Emitir el héroe creado
        this.cerrarDialogo();
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error al crear héroe:', error);
       }
    );
  }
}


