import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';
import { ToastComponent } from '../../shared/ui/toast/toast';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  protected openSidebar(): void {
    this.isSidebarOpen.set(true);
  }

  /** Closes the drawer and hands focus back to the control that opened it. */
  protected closeSidebar(): void {
    if (!this.isSidebarOpen()) {
      return;
    }

    this.isSidebarOpen.set(false);
    this.menuButton()?.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeSidebar();
  }

  protected onLogout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
