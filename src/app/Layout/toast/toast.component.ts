import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <!-- <div *ngIf="toast$ | async as toast" class="toast-container">
      <div class="toast" [ngClass]="toast.color">
        <mat-icon class="icon">{{ toast.icon }}</mat-icon>
        <span class="toast-message">
          <strong>{{ toast.title }}</strong>: {{ toast.message }}
        </span>
      </div>
    </div> -->
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #323232;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
    .toast.success { background: #28a745; }
    .toast.info { background: #17a2b8; }
    .toast.warning { background: #ffc107; }
    .toast.danger { background: #dc3545; }
    .icon { font-size: 20px; }
  `]
})
export class ToastComponent {
 
}
