import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  // Variable pour savoir si la sidebar est réduite ou pas
  isSidebarCollapsed: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Initialisation
  }

  // Fonction pour basculer la sidebar entre ouverte et réduite
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
