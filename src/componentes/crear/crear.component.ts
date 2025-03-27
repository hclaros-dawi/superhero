import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
 @Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearComponent implements OnInit {

  displayStatus = 'none';

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

}
