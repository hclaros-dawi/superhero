import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeroeInterface } from '../../models/heroeinterface';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
  selector: 'app-grid-heroes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CapitalizePipe
  ],
  templateUrl: './grid-heroes.component.html',
  styleUrl: './grid-heroes.component.scss'
})
export class GridHeroesComponent {
  @Input() heroes: HeroeInterface[] = [];
  @Input() filteredHeroes: HeroeInterface[] = [];
  @Input() loadedHeroes: HeroeInterface[] = [];
  @Input() loading: boolean = false;

  @Output() loadMore = new EventEmitter<void>();
  @Output() openCreateEditDialog = new EventEmitter<HeroeInterface>();
  @Output() openDeleteDialog = new EventEmitter<HeroeInterface>();
}
