import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SolicitudService } from '../../services/solicitud.service';
import { StrapiService } from '../../services/strapi.service';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css'
})
export class SolicitudesComponent implements OnInit {
  solicitudes = signal<any[]>([]);
  programadores = signal<any[]>([]);
  cargando = signal(true);
  guardando = signal<string>(''); // id de la solicitud que se está guardando
  mostrarLogin = false;

  // Para saber si el usuario es programador
  esProgramador = false;
  programadorActual: any = null;

  constructor(
    public authService: AuthService,
    private solicitudService: SolicitudService,
    private strapiService: StrapiService
  ) {}

  ngOnInit() {
    this.strapiService.getProgramadores().subscribe(async (progs) => {
      this.programadores.set(progs);
      const user = this.authService.currentUser();
      if (!user) { this.cargando.set(false); return; }

      this.esProgramador = this.authService.esProgramador(user.email, progs);
      this.programadorActual = this.authService.getProgramadorActual(user.email, progs);

      let solicitudes: any[];
      if (this.esProgramador && this.programadorActual) {
        solicitudes = await this.solicitudService.getSolicitudesPorProgramador(
          String(this.programadorActual.id)
        );
      } else {
        solicitudes = await this.solicitudService.getSolicitudesPorUsuario(user.uid);
      }

      // Enriquecer con nombre del programador
      this.solicitudes.set(solicitudes.map(s => ({
        ...s,
        nombreProgramador: progs.find(p => String(p.id) === String(s.programadorId))?.nombre ?? s.programadorId,
        _respuesta: s.respuesta ?? '',
        _editando: false
      })));

      this.cargando.set(false);
    });
  }

  toggleEditar(s: any) {
    s._editando = !s._editando;
  }

  async guardarRespuesta(s: any) {
    this.guardando.set(s.id);
    await this.solicitudService.actualizarSolicitud(s.id, {
      estado: 'Respondida',
      respuesta: s._respuesta
    });
    s.estado = 'Respondida';
    s.respuesta = s._respuesta;
    s._editando = false;
    this.guardando.set('');
  }

  formatFecha(ts: any): string {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
