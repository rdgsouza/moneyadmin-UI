import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

import { MessageService } from 'primeng/api';

import { RelatoriosService } from './../relatorios.service';

@Component({
  selector: 'app-relatorio-lancamentos',
  templateUrl: './relatorio-lancamentos.component.html',
  styleUrls: ['./relatorio-lancamentos.component.css']
})
export class RelatorioLancamentosComponent implements OnInit {

  periodoInicioQuitados: Date;
  periodoFimQuitados: Date;
  periodoInicioEmAberto: Date;
  periodoFimEmAberto: Date;
  temInfomacoes: boolean = false;

  ptbr: any;

  constructor(
    private relatoriosService: RelatoriosService,
    private messageService: MessageService,
    private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Relatórios');
    this.ptbr = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
      dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dayNamesMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
        "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sem'
    };
  }

  blobNotNull(input) {
    if (input instanceof Blob != null) {
      return true;
    } else {
      return false;
    }
  }

  gerarRelatorioQuitados() {
    this.relatoriosService.relatorioLancamentosPorPessoaReceitaDespesaQuitadas(
      this.periodoInicioQuitados, this.periodoFimQuitados)
      .then(relatorio => {
        if (relatorio.size > 0) {
          const url = window.URL.createObjectURL(relatorio);
          window.open(url);
        } else {
          this.messageService.add({ severity: 'warn',
          detail: 'Não existem dados referentes a data informada.' });
        }
      });
  }

  gerarRelatorioEmAberto() {
    this.relatoriosService.relatorioLancamentosPorPessoaReceitaDespesaEmAberto(
      this.periodoInicioEmAberto, this.periodoFimEmAberto)
      .then(relatorio => {
        if (relatorio.size > 0) {
          const url = window.URL.createObjectURL(relatorio);
          window.open(url);
        } else {
          this.messageService.add({ severity: 'warn',
          detail: 'Não existem dados referentes a data informada.' });
        }
      });
   }
}
