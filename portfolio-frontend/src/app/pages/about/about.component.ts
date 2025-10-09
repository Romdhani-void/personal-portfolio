import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  active: string | null = null;
  devopsDiagramUrl = 'assets/img/devops.png'; // <-- your uploaded image

  toggle(section: string) {
    this.active = this.active === section ? null : section;
  }
}
