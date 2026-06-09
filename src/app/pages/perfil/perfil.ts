import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StrapiService } from '../../services/strapi.service';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {
  programador = signal<any>(null);
  proyectos = signal<any[]>([]);
  cargando = signal(true);
  mostrarLogin = false;

  constructor(
    private route: ActivatedRoute,
    private strapiService: StrapiService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.strapiService.getProgramadorBySlug(slug).subscribe(p => {
      this.programador.set(p);
      if (p) {
        // Proyectos pueden venir como relación poblada
        const projs = p.proyectos?.data ?? p.proyectos ?? [];
        this.proyectos.set(projs.map((x: any) => ({ id: x.id, ...(x.attributes ?? x) })));
      }
      this.cargando.set(false);
    });
  }

  getTecnologias(p: any): string[] {
    if (!p.tecnologias) return [];
    if (Array.isArray(p.tecnologias)) return p.tecnologias;
    return p.tecnologias.split(',').map((t: string) => t.trim()).filter(Boolean);
  }

  getTexto(campo: any): string {
  if (!campo) return '';
  if (typeof campo === 'string') return campo;
  // Strapi blocks: array de bloques con children
  if (Array.isArray(campo)) {
    return campo
      .map((bloque: any) => bloque.children?.map((c: any) => c.text).join('') ?? '')
      .join('\n');
  }
  return '';
  }
}