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
  imports: [ CommonModule,
    FormsModule,              
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,      
    MatInputModule],
  templateUrl: './employee-data.component.html',
  styleUrls: ['./employee-data.component.css']
})
export class EmployeeDataComponent implements OnInit {

  http = inject(HttpClient);
  constructor(private dialog: MatDialog) {}

  employees: Employee[] = [];
  filteredEmployees: Employee[] = []; // Tableaux pour les employés filtrés
  apiUrl = 'https://localhost:7290/api/EmployeeMaster';
  searchQuery: string = ''; // Variable pour la recherche

  ngOnInit(): void {
    this.loadEmployees();
  }

  /** Charger la liste des employés */
  loadEmployees() {
    this.http.get<Employee[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data; // Initialiser les employés filtrés
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  /** Ouvrir le dialogue pour ajouter ou modifier un employé */
  openEmployeeDialog(employee?: Employee) {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      data: employee ? employee : null, // Ne pas passer un objet vide
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
    const { employeeId, ...employeeData } = newEmployee; // Exclure employeeId

    this.http.post<Employee>(this.apiUrl, employeeData).subscribe({
      next: (addedEmployee) => {
        this.employees.push(addedEmployee);
        this.filterEmployees(); // Refiltrer après ajout
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
          this.filterEmployees(); // Refiltrer après mise à jour
        }
      },
      error: (error) => {
        console.error('Error updating employee:', error);
      }
    });
  }

  /** Supprimer un employé */
  deleteEmployee(employeeId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent ,{
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`${this.apiUrl}/${employeeId}`).subscribe({
          next: () => {
            this.employees = this.employees.filter(emp => emp.employeeId !== employeeId);
            this.filterEmployees(); // Refiltrer après suppression
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
          }
        });
      }
    });
  }

  /** Fonction de filtrage des employés en fonction de la recherche */
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
}
