import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIcon
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})

export class DeleteComponent {
  private readonly dialogRef = inject(MatDialogRef<DeleteComponent>);

  protected deleteHero(): void {
    this.dialogRef.close(true);
  }

  protected closeDialog(): void {
    this.dialogRef.close(false);
  }
}
