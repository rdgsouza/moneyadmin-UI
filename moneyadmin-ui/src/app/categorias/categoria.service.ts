import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  categoriasUrl: string;

  constructor(private http: HttpClient) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`;
  }

  listarTodos(): Promise<any> {
    return this.http.get(`${this.categoriasUrl}`)
      .toPromise()
      .then(response => response);
  }
}

