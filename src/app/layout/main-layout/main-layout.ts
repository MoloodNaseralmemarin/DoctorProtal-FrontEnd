import { Component } from '@angular/core';
import { Headercomponent } from "../../shared/headercomponent/headercomponent";
import { FooterComponent } from "../../shared/footer-component/footer-component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-main-layout',
  imports: [Headercomponent, FooterComponent, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
