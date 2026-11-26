import { Component, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { ToastComponent } from '../../shared/toast-component/toast-component';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-dashboard-layoutcomponent',
  standalone: true,
  imports: [Sidebar, RouterOutlet, RouterModule, ToastComponent],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** Mobile drawer visibility; the sidebar is always visible from `lg` up. */
  readonly isSidebarOpen = signal(false);

  private readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');

  openSidebar(): void {
    this.isSidebarOpen.set(true);
  }

  /** Closes the drawer and hands focus back to the control that opened it. */
  closeSidebar(): void {
    if (!this.isSidebarOpen()) {
      return;
    }

    this.isSidebarOpen.set(false);
    this.menuButton()?.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeSidebar();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
