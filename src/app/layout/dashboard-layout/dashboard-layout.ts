import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { ToastComponent } from '../../shared/toast-component/toast-component';

@Component({
  selector: 'app-dashboard-layoutcomponent',
  standalone: true,
  imports: [Sidebar, RouterOutlet, RouterModule, ToastComponent],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {

}