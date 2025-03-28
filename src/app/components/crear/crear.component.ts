import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms'
import { HeroeInterface } from '../../interfaces/heroeinterface'; //importo la interfaz

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearComponent implements OnInit {

  displayStatus = 'none'; //controla si se muestra el formulario

  //Datos del formulario
  heroes: HeroeInterface = {
    id: 0,
    name: '',
    poderes: '',
    lugar: '',
    descripcion: '',
    imagen: null
  }

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  cerrarForm() {
    this.displayStatus = 'none'; //Cierra el formulario
  }

  abrirForm() {
    this.displayStatus = 'block'; //Muestra el formulario
    this.cdRef.detectChanges();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];  // Obtenemos el archivo seleccionado
    if (file) {
      const reader = new FileReader();  // Usamos un FileReader para convertirlo a base64

      reader.onload = (e: any) => {
        this.heroes.imagen = e.target.result;  // Asignamos la imagen convertida a base64
      };

      reader.readAsDataURL(file);  // Leemos el archivo como base64
    }
  }

  abrirDialogo():void {}

}
