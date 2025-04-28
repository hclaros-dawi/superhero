import { Component, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeroeInterface } from '../../models/heroeinterface';
import { MatDialogModule, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { HeroeService } from '../../servicios/heroe.service';
import { SnackbarService } from '../../servicios/snackbar.service';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-edit.component.html',
  styleUrl: './create-edit.component.scss',
})

export class CreateEditComponent implements OnInit {

  private readonly heroeService = inject(HeroeService);
  private readonly snackBarService = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogRef = inject(MatDialogRef<CreateEditComponent>);
  private readonly data = inject<HeroeInterface>(MAT_DIALOG_DATA);
  protected hero: HeroeInterface = { name: '', powers: '', location: '', description: '', image: '' };
  protected fileName: string = "";
  protected heroForm: FormGroup = new FormGroup({});
  protected isEditMode: boolean = false;

  ngOnInit(): void {
    if (this.data) {
      this.hero = this.data;
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }

    this.heroForm = new FormGroup({
      name: new FormControl(this.hero?.name || '', Validators.required),
      powers: new FormControl(this.hero?.powers || '', Validators.required),
      location: new FormControl(this.hero?.location || '', Validators.required),
      description: new FormControl(this.hero?.description || '', Validators.required),
      image: new FormControl(this.hero?.image ?? null),
      termsAccepted: new FormControl(
        this.isEditMode ? (this.hero?.termsAccepted ?? true) : null,
        this.isEditMode ? [] : [Validators.requiredTrue]
      )
    });

    if (this.isEditMode) {
      this.heroForm.patchValue({
        name: this.hero?.name || '',
        powers: this.hero?.powers || '',
        location: this.hero?.location || '',
        description: this.hero?.description || '',
        image: this.hero?.image ?? null,
        termsAccepted: this.hero?.termsAccepted ?? true
      });
    }
  }

  protected selectFile(fileInput: HTMLInputElement, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    fileInput.click();
  }

  protected handleFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      this.fileName = file.name;
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;

        if (typeof result === 'string') {
          this.heroForm.patchValue({ image: result });
        } else {
          this.snackBarService.showError('Ha ocurrido un error');
        }
      };
      reader.readAsDataURL(file);
    } else {
      this.fileName = "No hay archivo seleccionado";
    }
  }

  protected saveHero() {
    if (this.heroForm.invalid || (!this.isEditMode && !this.heroForm.value.termsAccepted)) {
      throw new Error('Formulario inválido o términos no aceptados');
    }
    
    const heroData: HeroeInterface = {
      name: this.heroForm.value.name,
      powers: this.heroForm.value.powers,
      location: this.heroForm.value.location,
      description: this.heroForm.value.description,
      image: this.heroForm.value.image,
      termsAccepted: this.heroForm.value.termsAccepted
    }

    if (this.hero?.id) {
      this.heroeService.updateHero({ ...heroData, id: this.hero.id }).subscribe({
        next: (updatedHero) => {
          this.dialogRef.close(updatedHero);
        },
        error: () => {
          this.snackBarService.showError('Error al editar héroe');
        }
      });
    } else {
      this.heroeService.createHero(heroData).subscribe({
        next: (newHero) => {
          this.dialogRef.close(newHero);
        },
        error: () => {
          this.snackBarService.showError('Error al crear héroe');
        }
      });
    }
  }

  protected closeDialog() {
    this.dialogRef.close();
  }
}

