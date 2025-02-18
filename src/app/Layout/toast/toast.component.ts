import { Component } from '@angular/core';
import { ToastService } from './toast.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-toast',
  imports: [CommonModule,MatIcon],
  template: `
    <div class="toast-container">
      <div class="toast" *ngFor="let toast of toastService.toasts$ | async" [ngClass]="toast.type">
        <mat-icon *ngIf="toast.icon">{{ toast.icon }}</mat-icon>
        <div class="toast-content">
          <strong>{{ toast.title }}</strong>
          <p>{{ toast.message }}</p>
        </div>
        <button class="close-btn" (click)="toastService.removeToast(toast)">✖</button>
      </div>
    </div>
  `,
  styleUrls: ['./toast.component.css']
})
  export class ToastComponent {
    constructor(public toastService: ToastService) {
      this.toastService.toasts$.subscribe(toasts => {
        console.log('Toasts reçus:', toasts);
      });
    }
  
  }
