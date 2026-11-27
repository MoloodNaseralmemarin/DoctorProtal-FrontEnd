import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

const AUTO_DISMISS_MS = 5000;

/**
 * Application-wide notifications. Toasts live in a signal, so the toast
 * component (which runs without zone.js) re-renders as soon as one is pushed
 * and no component needs to trigger change detection by hand.
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextId = 0;

  private readonly items = signal<readonly ToastMessage[]>([]);

  readonly toasts = this.items.asReadonly();

  show(message: string, type: ToastType = 'success'): void {
    const toast: ToastMessage = { id: this.nextId++, message, type };

    this.items.update((current) => [...current, toast]);
    setTimeout(() => this.dismiss(toast.id), AUTO_DISMISS_MS);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this.items.update((current) => current.filter((toast) => toast.id !== id));
  }
}
