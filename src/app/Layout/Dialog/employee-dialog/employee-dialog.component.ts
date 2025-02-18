import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.css']
})
export class EmployeeDialogComponent {
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.employeeForm = this.fb.group({
      employeeId: [data?.employeeId || null],
      firstName: [data?.firstName || '', Validators.required],
      lastName: [data?.lastName || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      contactNo: [data?.contactNo || '', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]], // Validation pour le numéro de téléphone
      city: [data?.city || '', Validators.required],
      address: [data?.address || '', Validators.required]
    });
  }

  // Fonction de sauvegarde de l'employé
  saveEmployee() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched(); // Marque tous les champs comme touchés
      return; // Si le formulaire est invalide, arrête l'exécution
    }
    this.dialogRef.close(this.employeeForm.value); // Ferme la boîte de dialogue et retourne les données du formulaire
  }

  // Fonction pour fermer la boîte de dialogue
  closeDialog() {
    this.dialogRef.close();
  }
}
