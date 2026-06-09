import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const STRAPI = 'http://localhost:1337';

@Injectable({ providedIn: 'root' })
export class StrapiService {
  constructor(private http: HttpClient) {}

  // Strapi v4/v5 devuelve { data: [ { id, ...attrs } ] }
  // Esta función normaliza para que quede { id, ...attrs }
  private normalize(res: any): any[] {
    if (!res?.data) return [];
    return res.data.map((item: any) => {
      const attrs = item.attributes ?? item;
      const { attributes, ...rest } = attrs;
      return { id: item.id, ...rest };
    });
  }

  private normalizeOne(res: any): any {
    if (!res?.data) return null;
    const item = res.data;
    const attrs = item.attributes ?? item;
    return { id: item.id, ...attrs };
  }

  getProgramadores(): Observable<any[]> {
    return this.http
      .get<any>(`${STRAPI}/api/programadors?populate=foto`)
      .pipe(map(r => this.normalize(r)));
  }

  getProgramadorBySlug(slug: string): Observable<any> {
  return this.http
    .get<any>(`${STRAPI}/api/programadors?filters[slug][$eq]=${slug}&populate=foto&populate=proyectos`)
    .pipe(map(r => (this.normalize(r)[0] ?? null)));
  }

  getProyectosDestacados(): Observable<any[]> {
  return this.http
    .get<any>(`${STRAPI}/api/proyectos?filters[destacado][$eq]=true&populate=programadors&populate=imagen`)
    .pipe(map(r => this.normalize(r)));
  }

  getServicios(): Observable<any[]> {
    return this.http
      .get<any>(`${STRAPI}/api/servicios`)
      .pipe(map(r => this.normalize(r)));
  }
}
