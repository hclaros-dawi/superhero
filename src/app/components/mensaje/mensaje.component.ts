import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-mensaje',
  standalone: true,
  imports: [],
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MensajeComponent {
  //input permite que los valores sean pasados desde el componente padre (home)
  //se recibe una propiedad de un componente x y podemos recibir valores desde el componente padre
  //en el padre <app-mensaje [mensaje]="Heroe creado con exito"></app-mensaje>
  @Input() tipo: 'exito' | 'error' = 'exito'; //si componente padre no especifica un valor para tipo, será considerado
  //exito por defecto
  @Input() mensaje: string = ''; //la propiedad de mensaje es string, pero si no es una cadena vacía por defecto

  constructor() { }
}
