import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeroeService } from '../../servicios/heroe.service'; //Importo los servicios en el componente principal
import { HeroeInterface } from '../../interfaces/heroeinterface'; //importo la interfaz
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';  // Importar el módulo MatFormFieldModule

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  heroes: HeroeInterface[] = []; //Define la propiedad de héroes como array de HeroeInterface
  errorMensaje: string = '';

  constructor(readonly service: HeroeService, readonly cdr: ChangeDetectorRef) { } //instanciamos el service para usar sus métodos

  ngOnInit(): void {
    this.service.buscarHeroes().subscribe({
      next: (heroes) => {
        this.heroes = heroes; //asigna los héroes obtenidos a la propiedad heroes en caso de éxito (como then, para éxito promesa)
        console.log("Héroes lista", this.heroes);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(this.errorMensaje); //maneja los errores que pueden ocurrir al intentar resolver observable (como catch)
      }
    });
  }
}
