import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <a class="nav-brand" routerLink="/">DevPortfolio</a>
      <ul class="nav-links">
        <li><a (click)="scrollTo('inicio')">Inicio</a></li>
        <li><a (click)="scrollTo('programadores')">Equipo</a></li>
        <li><a (click)="scrollTo('servicios')">Servicios</a></li>
        <li><a (click)="scrollTo('proyectos')">Proyectos</a></li>
        <li><a (click)="scrollTo('contacto')">Contacto</a></li>
        @if (authService.currentUser()) {
          <li><a routerLink="/solicitudes">Mis solicitudes</a></li>
        }
      </ul>
      <div class="nav-auth">
        @if (authService.currentUser()) {
          <span class="user-email">{{ authService.currentUser()?.email }}</span>
          <button class="btn-logout" (click)="authService.logout()">Cerrar sesión</button>
        } @else {
          <button class="btn-login" (click)="abrirLogin.emit()">Iniciar sesión</button>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #0f172a;
      position: sticky;
      top: 0;
      z-index: 100;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .nav-brand {
      color: #6366f1;
      font-size: 1.5rem;
      font-weight: bold;
      text-decoration: none;
    }
    .nav-links {
      list-style: none;
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .nav-links a {
      color: #cbd5e1;
      text-decoration: none;
      transition: color 0.3s;
      font-size: 0.95rem;
    }
    .nav-links a:hover { color: #6366f1; }
    .nav-auth { display: flex; align-items: center; gap: 1rem; }
    .user-email { color: #94a3b8; font-size: 0.85rem; }
    .btn-login {
      background: #6366f1; color: white; padding: 0.5rem 1.2rem;
      border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;
    }
    .btn-logout {
      background: transparent; color: #94a3b8; padding: 0.5rem 1rem;
      border: 1px solid #334155; border-radius: 6px; cursor: pointer; font-size: 0.9rem;
    }
    .btn-logout:hover { color: #ef4444; border-color: #ef4444; }
  `]
})
export class NavbarComponent {
  @Output() abrirLogin = new EventEmitter<void>();
  constructor(public authService: AuthService) {}

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#' + id;
    }
  }
}
