import { Component, OnInit, inject } from '@angular/core';
import { HeroeService } from '../../servicios/heroe.service';
import { SnackbarService } from '../../servicios/snackbar.service';
import { HeroeInterface } from '../../models/heroeinterface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FooterComponent } from '../footer/footer.component';
import { CreateEditComponent } from "../create-edit/create-edit.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderComponent } from "../header/header.component";
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { DeleteComponent } from '../delete/delete.component';
import { GridHeroesComponent } from '../grid-heroes/grid-heroes.component';
import { delay, switchMap } from 'rxjs/operators';

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

  private readonly maxPage: number = 8;
  private readonly heroService = inject(HeroeService);
  private readonly snackBarService = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);
  private page: number = 0;
  protected heroes: HeroeInterface[] = [];
  protected filteredHeroes: HeroeInterface[] = [];
  protected loadedHeroes: HeroeInterface[] = [];
  protected loading: boolean = false;

  ngOnInit(): void {
    this.loadHeroes();
  }

  protected loadMore = (): void => {
    if (this.page * this.maxPage < this.filteredHeroes.length) {

      const start = this.page * this.maxPage;
      const end = start + this.maxPage;
      const heroesToLoad = this.filteredHeroes.slice(start, end);

      heroesToLoad.forEach(hero => {
        if (!this.loadedHeroes.some(existingHero => existingHero.id === hero.id)) {
          this.loadedHeroes.push(hero);
        }
      });

      this.page += 1;
    }
  };

  protected loadHeroes = () => {
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
          this.snackBarService.showError('Ha ocurrido un error');
          this.loading = false;
        }
      });
  };

  protected handleFiltered(filteredHeroes: HeroeInterface[]): void {
    this.filteredHeroes = [...filteredHeroes];
    this.loadedHeroes = [];
    this.page = 0;
    this.loadMore();
  }

  protected openDeleteDialog(hero: HeroeInterface): void {
    const dialogRef = this.dialog.open(DeleteComponent);

    dialogRef.afterClosed().pipe(
      switchMap((confirmed) => {
        if (confirmed && hero.id) {
          return this.heroService.deleteHero(hero.id);
        } else {
          return [];
        }
      })
    ).subscribe({
      next: () => {
        this.heroes = this.heroes.filter(h => h.id !== hero.id);
        this.filteredHeroes = this.filteredHeroes.filter(h => h.id !== hero.id);
        this.loadedHeroes = this.loadedHeroes.filter(h => h.id !== hero.id);

        this.snackBarService.showSuccess('Este héroe se ha eliminado');
      },
      error: () => {
        this.snackBarService.showError('Ha ocurrido un error');
      }
    });
  }

  protected openCreateEditDialog(hero?: HeroeInterface): void {
    const dialogRef = this.dialog.open(CreateEditComponent, {
      data: hero ? { ...hero } : null
    });

    dialogRef.afterClosed().subscribe((createdOrUpdatedHero) => {
      if (createdOrUpdatedHero) {
        if (hero) {
          this.heroes = this.heroes.map(h => h.id === createdOrUpdatedHero.id ? createdOrUpdatedHero : h);
          this.filteredHeroes = this.filteredHeroes.map(h => h.id === createdOrUpdatedHero.id ? createdOrUpdatedHero : h);
          this.loadedHeroes = this.loadedHeroes.map(h => h.id === createdOrUpdatedHero.id ? createdOrUpdatedHero : h);

          this.snackBarService.showSuccess('Héroe modificado con éxito');

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

          this.snackBarService.showSuccess('Héroe creado con éxito');
        }
      } else if (createdOrUpdatedHero === false) {
        this.snackBarService.showError('Ha ocurrido un error');
      }
    });
  }
}
