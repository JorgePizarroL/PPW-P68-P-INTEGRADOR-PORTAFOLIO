import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SolicitudService } from '../../services/solicitud.service';
import { StrapiService } from '../../services/strapi.service';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  programadores = signal<any[]>([]);
  proyectos = signal<any[]>([]);
  servicios = signal<any[]>([]);

  mostrarLogin = false;
  modoRegistro = false;
  emailAuth = '';
  passwordAuth = '';
  errorAuth = '';
  cargandoAuth = false;

  solicitudEnviada = false;
  solicitud = { nombre: '', correo: '', descripcion: '', programadorId: '' };

  constructor(
    public authService: AuthService,
    private solicitudService: SolicitudService,
    private strapiService: StrapiService
  ) {}

  ngOnInit() {
    this.strapiService.getProgramadores().subscribe(data => this.programadores.set(data));
    this.strapiService.getProyectosDestacados().subscribe(data => this.proyectos.set(data));
    this.strapiService.getServicios().subscribe(data => this.servicios.set(data));
  }

  async submitAuth() {
    this.errorAuth = '';
    this.cargandoAuth = true;
    try {
      if (this.modoRegistro) {
        await this.authService.registro(this.emailAuth, this.passwordAuth);
      } else {
        await this.authService.login(this.emailAuth, this.passwordAuth);
      }
      this.mostrarLogin = false;
      this.emailAuth = '';
      this.passwordAuth = '';
    } catch (error: any) {
      const msgs: any = {
        'auth/email-already-in-use': 'El correo ya está registrado.',
        'auth/invalid-email': 'Correo inválido.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/user-not-found': 'Usuario no encontrado.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-credential': 'Correo o contraseña incorrectos.'
      };
      this.errorAuth = msgs[error.code] ?? error.message;
    } finally {
      this.cargandoAuth = false;
    }
  }

  async enviarSolicitud() {
    const user = this.authService.currentUser();
    if (!user || !this.solicitud.programadorId) return;
    await this.solicitudService.crearSolicitud({
      ...this.solicitud,
      uid: user.uid,
      correoUsuario: user.email
    });
    this.solicitudEnviada = true;
    this.solicitud = { nombre: '', correo: '', descripcion: '', programadorId: '' };
  }

  getTecnologias(p: any): string[] {
    if (!p.tecnologias) return [];
    if (Array.isArray(p.tecnologias)) return p.tecnologias;
    return p.tecnologias.split(',').map((t: string) => t.trim()).filter(Boolean);
  }

  getProgramadoresDelProyecto(p: any): string {
    const progs = p.programadors?.data ?? p.programadors ?? [];
    return progs.map((x: any) => x.nombre ?? x.attributes?.nombre ?? '').filter(Boolean).join(', ');
  }
}
