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

export class EliminarComponent { //no onInit porque no carga datos, solo muestra mensaje
  constructor(public dialogRef: MatDialogRef<EliminarComponent>) { } //con MatDialogRef, abro, cierro, paso datos sin inyectar MAT_DIALOG_DATA

  //lo gestiona el boolean confirmed (home)
  //si usuario confirma eliminación
  eliminarHeroe(): void {
    //cierra dialog y envia T al componente que lo abrió (home)--> confirmed == true, elimina
    this.dialogRef.close(true);
  }

  //si usuario cancela eliminación
  cerrarMensaje(): void {
    //cierra dialog y envia F al componente que lo abrió (home)--> confirmed == false, solo cierra dialog
    this.dialogRef.close(false);
  }
}
