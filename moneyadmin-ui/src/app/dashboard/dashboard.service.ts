import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  lancamentosReceitaPorCategoria(): Promise<Array<any>> {
    return this.http.get(`${this.lancamentosUrl}/estatisticas/receita-por-categoria`)
      .toPromise()
      .then(response => response as Array<any>);

    // Como visto acima não utilizamos o método "json" do response.
    // Como visto anteriormente isso não é mais necessário, visto que o response já é
    // o nosso objeto de resposta.
    // A única diferença, foi que precisamos fazer o cast para "Array", para garatirmos
    // a tipagem do mesmo.
    // Com isso podemos manter a mesma assinatura do método, o qual devolve uma Promise
    // de Array
  }

  lancamentosDespesaPorCategoria(): Promise<Array<any>> {
    return this.http.get(`${this.lancamentosUrl}/estatisticas/despesa-por-categoria`)
      .toPromise()
      .then(response => response as Array<any>);
  }


  lancamentosPorDia(): Promise<Array<any>> {
    return this.http.get(`${this.lancamentosUrl}/estatisticas/por-dia`)
      .toPromise()
      .then(response => {
        const dados = response as Array<any>;
        this.converterStringsParaDatas(dados);

        return dados;
      });
  }

  private converterStringsParaDatas(dados: Array<any>) {

    for (const dado of dados) {

      dado.dia = moment(dado.dia, 'yyyy-MM-DD').toDate();
    }
  }

}
