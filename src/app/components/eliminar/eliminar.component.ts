import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { HeroeInterface } from '../../interfaces/heroeinterface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    @Inject(MAT_DIALOG_DATA) public data: HeroeInterface
  ) { }

  eliminarHeroe(): void {
    this.dialogRef.close(true);
  }

  cerrarMensaje(): void {
    this.dialogRef.close(false); //oculta la ventana sin eliminar
  }
}
