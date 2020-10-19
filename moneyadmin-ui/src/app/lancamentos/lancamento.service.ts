import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { Lancamento } from './../core/model';

export class LancamentoFiltro {
  nome: string;
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  urlUploadAnexo(): string {
    return `${this.lancamentosUrl}/anexo`;
  }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {

    let params = new HttpParams();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params = params.set('pessoa.nome', filtro.nome);
    }

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }

    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }

    return this.http.get(`${this.lancamentosUrl}?resumo`, { params })
      //  Depois do parametro resumo passamos tambem  as variaveis headers e params
      // como objeto literal na variavel headers enviaremos o cabeçalho da requisiçao e no params
      // enviaremos os parametros que vão ser adicionado dinamicamente ja o parametro resumo que
      // foi colocado de forma direta ele nao vai mudar sempre vai ser ele para trazer os resumos
      // dos lançamentos.
      .toPromise()
      .then(response => {
        // tslint:disable-next-line:no-string-literal
        const lancamentos = response['content'];
        const resultado = {
          lancamentos,
          // tslint:disable-next-line:no-string-literal
          total: response['totalElements']
        };
        return resultado;
      });
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {

    return this.http.post<Lancamento>(
      this.lancamentosUrl, lancamento)
      .toPromise()
      .then(response => response);
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {

    return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`,
      lancamento)
      .toPromise()
      .then(response => {
        const lancamentoAlterado = response as Lancamento;
        this.converterStringParaDatas([lancamentoAlterado]);

        return lancamentoAlterado;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento> {
    return this.http.get(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const lancamento = response as Lancamento;

        this.converterStringParaDatas([lancamento]);

        return lancamento;
      });
  }

  private converterStringParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento,
        'yyyy-MM-DD').toDate();

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento,
          'YYYY-MM-DD').toDate();
      }
    }
  }

}
