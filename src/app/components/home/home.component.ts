import { Component, OnInit, inject } from '@angular/core';
import { HeroeService } from '../../servicios/heroe.service';
import { HeroeInterface } from '../../interfaces/heroeinterface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FooterComponent } from '../footer/footer.component';
import { CreateEditComponent } from "../create-edit/create-edit.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderComponent } from "../header/header.component";
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { DeleteComponent } from '../delete/delete.component';
import { GridHeroesComponent } from '../grid-heroes/grid-heroes.component';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    FooterComponent,
    MatDialogModule,
    SearchBarComponent,
    MatProgressSpinnerModule,
    HeaderComponent,
    GridHeroesComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})

export class HomeComponent implements OnInit {

  heroes: HeroeInterface[] = [];
  filteredHeroes: HeroeInterface[] = [];
  loadedHeroes: HeroeInterface[] = [];
  page: number = 0;
  maxPage: number = 8;
  loading: boolean = false;

  private readonly heroService = inject(HeroeService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadHeroes();
  }

  loadMore = () => {
    if (this.page * this.maxPage >= this.filteredHeroes.length) return;

    const start = this.page * this.maxPage;
    const end = start + this.maxPage;
    const heroesToLoad = this.filteredHeroes.slice(start, end);

    heroesToLoad.forEach(hero => {
      if (!this.loadedHeroes.some(existingHero => existingHero.id === hero.id)) {
        this.loadedHeroes.push(hero);
      }
    });

    this.page += 1;
  };

  loadHeroes = () => {
    this.loading = true;

    this.heroService.getHeroes()
      .pipe(delay(1300))
      .subscribe({
        next: (data: HeroeInterface[]) => {
          this.heroes = data;
          this.filteredHeroes = [...this.heroes];
          this.loadedHeroes = [];
          this.page = 0;
          this.loadMore();
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Ha ocurrido un error', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
  };

  handleFiltered(filteredHeroes: HeroeInterface[]): void {
    this.filteredHeroes = [...filteredHeroes];
    this.loadedHeroes = [];
    this.page = 0;
    this.loadMore();
  }

  openDeleteDialog(hero: HeroeInterface): void {
    const dialogRef = this.dialog.open(DeleteComponent);

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed && hero.id) {
        this.heroService.deleteHero(hero.id).subscribe({
          next: () => {
            this.heroes = this.heroes.filter(h => h.id !== hero.id);
            this.filteredHeroes = this.filteredHeroes.filter(h => h.id !== hero.id);
            this.loadedHeroes = this.loadedHeroes.filter(h => h.id !== hero.id);

            this.snackBar.open('Este héroe se ha eliminado', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['exito-snackbar']
            });
          },
          error: () => {
            this.snackBar.open('Ha ocurrido un error', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  openCreateEditDialog(hero?: HeroeInterface): void {
    const dialogRef = this.dialog.open(CreateEditComponent, {
      data: hero ? { ...hero } : null
    });

    dialogRef.afterClosed().subscribe((createdOrUpdatedHero) => {
      if (createdOrUpdatedHero) {
        if (hero) {
          this.heroes = this.heroes.map(h => h.id === createdOrUpdatedHero.id ? createdOrUpdatedHero : h);
          this.filteredHeroes = this.filteredHeroes.map(h => h.id === createdOrUpdatedHero.id ? createdOrUpdatedHero : h);
          this.loadedHeroes = this.loadedHeroes.map(h => h.id === createdOrUpdatedHero.id ? createdOrUpdatedHero : h);

          this.snackBar.open('Héroe modificado con éxito', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['exito-snackbar']
          });
        } else {
          if (!this.heroes.some(h => h.id === createdOrUpdatedHero.id)) {
            this.heroes = [...this.heroes, createdOrUpdatedHero];
          }
          if (!this.filteredHeroes.some(h => h.id === createdOrUpdatedHero.id)) {
            this.filteredHeroes = [...this.filteredHeroes, createdOrUpdatedHero];
          }
          if (this.page * this.maxPage >= this.filteredHeroes.length) {
            this.loadedHeroes.push(createdOrUpdatedHero);
          }

          this.snackBar.open('Héroe creado con éxito', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['exito-snackbar']
          });
        }
      } else if (createdOrUpdatedHero === false) {
        this.snackBar.open('Error al crear/actualizar héroe', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
