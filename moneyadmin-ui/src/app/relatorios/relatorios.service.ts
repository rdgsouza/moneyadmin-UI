import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from './../../environments/environment';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {


  lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  relatorioLancamentosPorPessoaReceitaDespesaQuitadas(inicio: Date, fim: Date) {
    // Para declarar os parâmetros
    let params = new HttpParams();
    params = params.set('inicio', moment(inicio).format('YYYY-MM-DD'));
    params = params.set('fim', moment(fim).format('YYYY-MM-DD'));

    // Para a requisição
    return this.http.get(`${this.lancamentosUrl}/relatorios/por-pessoa-receita-despesa-quitadas`,
      { params, responseType: 'blob' })
      .toPromise()
      .then(response => response);
  }


  relatorioLancamentosPorPessoaReceitaDespesaEmAberto(inicio: Date, fim: Date) {
    // Para declarar os parâmetros
    let params = new HttpParams();
    params = params.set('inicio', moment(inicio).format('YYYY-MM-DD'));
    params = params.set('fim', moment(fim).format('YYYY-MM-DD'));

    // Para a requisição
    return this.http.get(`${this.lancamentosUrl}/relatorios/por-pessoa-receita-despesa-em-aberto`,
      { params, responseType: 'blob' })
      .toPromise()
      .then(response => response);
  }

  // Moment.js é uma biblioteca JavaScript de código aberto e gratuita que remove a
  // necessidade de usar o objeto Data JavaScript nativo diretamente. A biblioteca é
  // um invólucro para o objeto Date (da mesma forma que o jQuery é um invólucro para
  // JavaScript ), facilitando muito o trabalho com o objeto.
  // Podemos então passar o objeto para String e String para objeto


  // Transformando de String para objeto Date
  // dado.dia = moment(dado.dia, 'YYYY-MM-DD').toDate();
  // Exemplo acima e da aula: https://www.algaworks.com/aulas/1741/criando-o-servico-da-dashboard/
  // minuto do video: 6:32

  // Transformando de Objeto Date para string
  // params = params.set('inicio', moment(inicio).format('YYYY-MM-DD'));
  // Exemplo acima e da aula: https://www.algaworks.com/aulas/1747/exibindo-o-pdf-para-o-usuario/
  // minuto do video: 7:05

}
