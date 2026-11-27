import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ServiceDto } from '../../core/models/service.model';
import { ServiceCatalogService } from '../../core/services/service-catalog.service';
import { lockBodyScroll, unlockBodyScroll } from '../../core/ui/body-scroll-lock';

type ServicesState = 'loading' | 'ready' | 'empty' | 'error';

/** Public "services" section, with a modal that shows the full description. */
@Component({
  selector: 'app-services-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './services-section.html',
})
export class ServicesSectionComponent {
  private readonly catalog = inject(ServiceCatalogService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly services = signal<readonly ServiceDto[]>([]);
  protected readonly status = signal<ServicesState>('loading');
  protected readonly selectedService = signal<ServiceDto | null>(null);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.status.set('loading');

    this.catalog
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

  protected openModal(service: ServiceDto): void {
    this.selectedService.set(service);
    lockBodyScroll();
  }

  protected closeModal(): void {
    if (!this.selectedService()) {
      return;
    }

    this.selectedService.set(null);
    unlockBodyScroll();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeModal();
  }
}
