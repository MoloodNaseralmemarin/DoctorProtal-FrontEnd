import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ServiceDto } from '../../../models/ServiceDto';
import { Service } from '../../services/services';

type ServicesState = 'loading' | 'ready' | 'empty' | 'error';

@Component({
  selector: 'app-service-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-list-component.html',
})
export class ServiceListComponent {
  private readonly serviceService = inject(Service);
  private readonly destroyRef = inject(DestroyRef);

  readonly services = signal<ServiceDto[]>([]);
  readonly status = signal<ServicesState>('loading');
  readonly selectedService = signal<ServiceDto | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.status.set('loading');

    this.serviceService
      .getServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (services) => {
          const items = Array.isArray(services) ? services : [];
          this.services.set(items);
          this.status.set(items.length ? 'ready' : 'empty');
        },
        error: () => {
          this.services.set([]);
          this.status.set('error');
        },
      });
  }

  openModal(service: ServiceDto) {
    this.selectedService.set(service);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    this.selectedService.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }
}
