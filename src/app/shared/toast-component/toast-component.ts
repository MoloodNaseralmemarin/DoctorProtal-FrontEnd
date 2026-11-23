import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
      @for (toast of toasts; track toast.id) {
        <div
          class="pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl border transition-all duration-300 animate-in slide-in-from-top-4"
          [ngClass]="{
            'bg-white border-emerald-100 text-emerald-900': toast.type === 'success',
            'bg-white border-red-100 text-red-900': toast.type === 'error',
            'bg-white border-blue-100 text-blue-900': toast.type === 'info'
          }"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            [ngClass]="{
              'bg-emerald-50 text-emerald-600': toast.type === 'success',
              'bg-red-50 text-red-600': toast.type === 'error',
              'bg-blue-50 text-blue-600': toast.type === 'info'
            }"
          >
            <i class="fas" [ngClass]="{
              'fa-check-circle': toast.type === 'success',
              'fa-exclamation-circle': toast.type === 'error',
              'fa-info-circle': toast.type === 'info'
            }"></i>
          </div>
          <p class="font-bold text-sm leading-tight">{{ toast.message }}</p>
          <button (click)="remove(toast.id)" class="mr-auto text-slate-400 hover:text-slate-600 transition-colors p-2">
            <i class="fas fa-times"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private sub?: Subscription;
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sub = this.toastService.toasts$.subscribe(toast => {
      this.toasts.push(toast);
      this.cdr.detectChanges();

      // Auto remove after 5 seconds
      const timer = setTimeout(() => {
        this.timers.delete(timer);
        this.remove(toast.id);
      }, 5000);
      this.timers.add(timer);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.cdr.detectChanges();
  }
}
