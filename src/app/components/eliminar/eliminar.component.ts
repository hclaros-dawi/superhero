import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; //directivas (ngif, ngfor, ng-template)
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-eliminar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIcon],
  templateUrl: './eliminar.component.html',
  styleUrl: './eliminar.component.scss'
})
export class EliminarComponent {
  constructor(
    public dialogRef: MatDialogRef<EliminarComponent>,
  ) { }

  eliminarHeroe(): void {
    this.dialogRef.close(true);
  }

  cerrarMensaje(): void {
    this.dialogRef.close(false); //oculta la ventana sin eliminar
  }
}
