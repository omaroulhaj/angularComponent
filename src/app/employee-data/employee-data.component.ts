import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EmployeeDialogComponent } from '../Layout/Dialog/employee-dialog/employee-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from '../Layout/Dialog/confirm-dialog/confirm-dialog.component';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  city: string;
  address: string;
}

@Component({
  selector: 'app-employee-data',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginator,
    MatAutocompleteModule
  ],
  templateUrl: './employee-data.component.html',
  styleUrls: ['./employee-data.component.css'],
})
export class EmployeeDataComponent implements OnInit {
  http = inject(HttpClient);
  constructor(private dialog: MatDialog) {}

  // Variables pour suivre l'ordre de tri
  sortOrder: { firstName: boolean, lastName: boolean } = { firstName: true, lastName: true };

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  apiUrl = 'https://localhost:7290/api/EmployeeMaster';
  searchQuery: string = '';
  pageSize: number = 6; // Nombre d'employés par page
  pageIndex: number = 0;

  // Propriété pour gérer les toasts
  toasts: { title: string, message: string, icon: string, isVisible: boolean }[] = [];

  ngOnInit(): void {
    this.loadEmployees();
  }

  /** Charger la liste des employés */
  loadEmployees() {
    this.http.get<Employee[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  /** Méthode pour trier les employés par prénom */
  sortByFirstName() {
    this.sortOrder.firstName = !this.sortOrder.firstName; // Alterner l'ordre
    this.filteredEmployees.sort((a, b) => this.sortOrder.firstName
      ? a.firstName.localeCompare(b.firstName)
      : b.firstName.localeCompare(a.firstName));
  }

  /** Méthode pour trier les employés par nom de famille */
  sortByLastName() {
    this.sortOrder.lastName = !this.sortOrder.lastName; // Alterner l'ordre
    this.filteredEmployees.sort((a, b) => this.sortOrder.lastName
      ? a.lastName.localeCompare(b.lastName)
      : b.lastName.localeCompare(a.lastName));
  }

  /** Fonction pour appliquer la pagination */
  get paginatedEmployees(): Employee[] {
    return this.filteredEmployees.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  /** Ouvrir le dialogue pour ajouter ou modifier un employé */
  openEmployeeDialog(employee?: Employee) {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      data: employee ? employee : null,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (employee) {
          this.updateEmployee(result); // Mise à jour
        } else {
          this.addEmployee(result); // Ajout
        }
      }
    });
  }

  /** Ajouter un employé */
  addEmployee(newEmployee: Employee) {
    const { employeeId, ...employeeData } = newEmployee;
    this.http.post<Employee>(this.apiUrl, employeeData).subscribe({
      next: (addedEmployee) => {
        this.employees.push(addedEmployee);
        this.filterEmployees();
      },
      error: (error) => {
        console.error('Error adding employee:', error.error.errors || error.message);
      }
    });
  }

  /** Modifier un employé */
  updateEmployee(updatedEmployee: Employee) {
    this.http.put(`${this.apiUrl}/${updatedEmployee.employeeId}`, updatedEmployee).subscribe({
      next: () => {
        const index = this.employees.findIndex(emp => emp.employeeId === updatedEmployee.employeeId);
        if (index !== -1) {
          this.employees[index] = updatedEmployee;
          this.filterEmployees();
        }
      },
      error: (error) => {
        console.error('Error updating employee:', error);
      }
    });
  }

  /** Supprimer un employé */
  deleteEmployee(employeeId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`${this.apiUrl}/${employeeId}`).subscribe({
          next: () => {
            this.employees = this.employees.filter(emp => emp.employeeId !== employeeId);
            this.filterEmployees();
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
          }
        });
      }
    });
  }

  /** Filtrer les employés par la barre de recherche */
  filterEmployees() {
    if (this.searchQuery.trim()) {
      this.filteredEmployees = this.employees.filter(emp => 
        emp.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredEmployees = [...this.employees];
    }
  }

  /** Méthode appelée lors de la modification de la barre de recherche */
  onSearchChange() {
    this.filterEmployees();
  }

  /** Afficher un toast */



}
