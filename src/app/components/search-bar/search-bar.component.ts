import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { HeroeService } from '../../servicios/heroe.service';
import { HeroeInterface } from '../../models/heroeinterface';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  private readonly fb = inject(FormBuilder);

  searchForm = this.fb.group({
    heroeInput: ['', Validators.required]
  });

  private readonly heroes: HeroeInterface[] = [];
  private readonly heroeService = inject(HeroeService);
  private readonly capitalizePipe = inject(CapitalizePipe);
  private page: number = 0;
  private loadedHeroes: HeroeInterface[] = [];
  private filteredHeroes: HeroeInterface[] = [];

  @Input() fnLoadMore!: () => void;
  @Input() fnLoadHeroes!: () => void;
  @Output() onHeroCreated = new EventEmitter<void>();
  @Output() onHeroFiltered = new EventEmitter<HeroeInterface[]>();

  protected filterHeroByName(): void {
    if (this.searchForm.valid) {

    this.page = 0;
    let searchedHero = this.searchForm.get('heroeInput')?.value;
    if (!searchedHero?.trim()) {
      this.filteredHeroes = this.heroes;
      this.onHeroFiltered.emit(this.filteredHeroes);
    } else {
      searchedHero = this.capitalizePipe.transform(searchedHero);
      this.heroeService.filterByName(searchedHero).subscribe((heroes) => {
        this.filteredHeroes = heroes;
        this.onHeroFiltered.emit(this.filteredHeroes);
      });
    }

    this.loadedHeroes = [];
  }
}

  protected onCreateButtonClick(): void {
    this.onHeroCreated.emit();
  }
}
