import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [],
  templateUrl: './editar.componente.html',
  styleUrl: './editar.componente.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditarComponent { }
