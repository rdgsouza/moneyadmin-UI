import { Estado, Cidade } from './../core/model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Pessoa } from '../core/model';
import { environment } from './../../environments/environment';

export class PessoaFiltro {

  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  pessoasUrl: string;
  pessoasUrlPesquisaNomeAsc: string;
  // O Pageable do Spring já conta com suporte à ordenação. Para ordenar sua pesquisa por
  // nome de forma crescente/ascendente basta enviar o parâmetro "sort" na requisição como na
  // propiedade pessoasUrlPesquisaNomeAsc abaixo.
  cidadesUrl: string;
  estadosUrl: string;

  constructor(private http: HttpClient) {
    this.pessoasUrl = `${environment.apiUrl}/pessoas`;
    this.pessoasUrlPesquisaNomeAsc = `${environment.apiUrl}/pessoas?sort=nome,asc`;
    this.estadosUrl = `${environment.apiUrl}/estados`;
    this.cidadesUrl = `${environment.apiUrl}/cidades`;
  }

  listarTodos(): Promise<any> {
    return this.http.get(`${this.pessoasUrlPesquisaNomeAsc}`)
      .toPromise()
      // tslint:disable-next-line:no-string-literal
      .then(response => response['content']);
  }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.pessoasUrlPesquisaNomeAsc}`, { params })
      .toPromise()
      .then(response => {
        // tslint:disable-next-line:no-string-literal
        const pessoas = response['content'];
        const resultado = {
          pessoas,
          // tslint:disable-next-line:no-string-literal
          total: response['totalElements']
        };
        return resultado;
      });
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.pessoasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders().append('Content-Type',
      'application/json');
    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.post<Pessoa>(
      this.pessoasUrl, pessoa)
      .toPromise();
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`,
      pessoa)
      .toPromise()
      .then(response => {
        const pessoaAlterada = response as Pessoa;

        return pessoaAlterada;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    return this.http.get(`${this.pessoasUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const pessoa = response as Pessoa;

        return pessoa;
      });
  }

  listarEstados(): Promise<Estado[]> {
    return this.http.get(this.estadosUrl).toPromise()
      .then(response => response as Cidade[]);
  }

  pesquisarCidades(estado): Promise<Cidade[]> {
    let params = new HttpParams();
    params = params.set('estado', estado);
    return this.http.get(this.cidadesUrl, { params })
      .toPromise()
      .then(response => response as Cidade[]);
  }

}
