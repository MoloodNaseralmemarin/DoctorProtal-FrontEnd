import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../../../core/services/toast.service';

/** Floating notifications for the dashboard; fed by `ToastService`. */
@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl border transition-all duration-300 animate-in slide-in-from-top-4"
          [class]="containerClass(toast.type)"
        >
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            [class]="iconContainerClass(toast.type)"
          >
            <i class="fas" [class]="iconClass(toast.type)" aria-hidden="true"></i>
          </div>
          <p class="font-bold text-sm leading-tight">{{ toast.message }}</p>
          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            aria-label="بستن پیام"
            class="mr-auto text-slate-400 hover:text-slate-600 transition-colors p-2"
          >
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);

  protected containerClass(type: ToastType): string {
    switch (type) {
      case 'error':
        return 'bg-white border-red-100 text-red-900';
      case 'info':
        return 'bg-white border-blue-100 text-blue-900';
      default:
        return 'bg-white border-emerald-100 text-emerald-900';
    }
  }

  protected iconContainerClass(type: ToastType): string {
    switch (type) {
      case 'error':
        return 'bg-red-50 text-red-600';
      case 'info':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-emerald-50 text-emerald-600';
    }
  }

  protected iconClass(type: ToastType): string {
    switch (type) {
      case 'error':
        return 'fa-exclamation-circle';
      case 'info':
        return 'fa-info-circle';
      default:
        return 'fa-check-circle';
    }
  }
}
