import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { SolicitudService } from './solicitud.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  programadores = signal<any[]>([]);
  proyectos = signal<any[]>([]);
  servicios = signal<any[]>([]);

  mostrarLogin = false;
  modoRegistro = false;
  emailAuth = '';
  passwordAuth = '';
  errorAuth = '';

  solicitudEnviada = false;
  solicitud = {
    nombre: '',
    correo: '',
    descripcion: '',
    programadorId: ''
  };

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private solicitudService: SolicitudService
  ) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:1337/api/programadors?populate=foto').subscribe(res => {
      this.programadores.set(res.data);
    });

    this.http.get<any>('http://localhost:1337/api/proyectos?filters[destacado][$eq]=true&populate=programadors').subscribe(res => {
      this.proyectos.set(res.data);
    });

    this.http.get<any>('http://localhost:1337/api/servicios').subscribe(res => {
      this.servicios.set(res.data);
    });
  }

  async submitAuth() {
    this.errorAuth = '';
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
      this.errorAuth = error.message;
    }
  }

  async logout() {
    await this.authService.logout();
  }

  async enviarSolicitud() {
    const user = this.authService.currentUser();
    if (!user) return;
    await this.solicitudService.crearSolicitud({
      ...this.solicitud,
      uid: user.uid,
      correoUsuario: user.email
    });
    this.solicitudEnviada = true;
    this.solicitud = { nombre: '', correo: '', descripcion: '', programadorId: '' };
  }
}
