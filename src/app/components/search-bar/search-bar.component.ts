import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { HeroeService } from '../../servicios/heroe.service';
import { HeroeInterface } from '../../interfaces/heroeinterface';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  searchForm = new FormGroup({
    heroeInput: new FormControl('')
  });

  heroes: HeroeInterface[] = [];
  page: number = 0;
  filteredHeroes: HeroeInterface[] = [];
  loadedHeroes: HeroeInterface[] = [];
  private readonly heroeService = inject(HeroeService);

  @Input() fnLoadMore!: () => void;
  @Input() fnLoadHeroes!: () => void;
  @Output() onHeroCreated = new EventEmitter<void>();
  @Output() onHeroFiltered = new EventEmitter<HeroeInterface[]>();

  filterHeroByName(): void {
    this.page = 0;
    const searchedHero = this.searchForm.get('heroeInput')?.value;
    if (!searchedHero?.trim()) {
      this.filteredHeroes = this.heroes;
      this.onHeroFiltered.emit(this.filteredHeroes);
    } else {
      this.heroeService.filterByName(searchedHero).subscribe((heroes) => {
        this.filteredHeroes = heroes;
        this.onHeroFiltered.emit(this.filteredHeroes);
      });
    }
    this.loadedHeroes = [];
  }

  onCreateButtonClick(): void {
    this.onHeroCreated.emit();
  }
}
