import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  title: string;
  message: string;
  icon?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  showToast(toast: Toast) {
    console.log('Toast ajouté:', toast);
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);
  
    setTimeout(() => {
      this.removeToast(toast);
    }, toast.duration || 3000);
  }
  

  removeToast(toast: Toast) {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t !== toast));
  }
}
