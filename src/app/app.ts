import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  programadores = signal<any[]>([]);
  proyectos = signal<any[]>([]);
  servicios = signal<any[]>([]);

  constructor(private http: HttpClient) {}

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
}
