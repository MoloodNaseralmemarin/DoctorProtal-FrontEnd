import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ServiceDto } from '../../../models/ServiceDto';
import { Service } from '../../services/services';


@Component({
  selector: 'app-service-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-list-component.html',
})
export class ServiceListComponent {
  services$!: Observable<ServiceDto[]>;
  selectedService = signal<ServiceDto | null>(null);

  constructor(private serviceService: Service) {
    this.services$ = this.serviceService.getServices();
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
