import { AuthService } from './../../seguranca/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api/public_api';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table/table';
import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})

export class LancamentosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new LancamentoFiltro();
  lancamentos = [];
  @ViewChild('tabela', { static: true }) tabela: Table;
  paginaAtual = 0;
  ptbr: any;

  constructor(
    private lancamentoService: LancamentoService,
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de lançamentos');
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

  resetarTabela() {
    this.tabela.first = 0;
  }

  pesquisar(pagina = 0) {
    if (pagina === 0) {
      this.resetarTabela();
    }
    this.filtro.pagina = pagina;
    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    this.paginaAtual = event.first / event.rows;
    this.pesquisar(this.paginaAtual);

  }

  confirmarExclusao(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: any) {
    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        // this.tabela.reset();
        // Podemos fazer dessa forma tambem para reniciar a tabela o if que usamos e
        // para verifica se estar na primeira pagina se estiver chama o metodo pesquisar
        // e com isso renicia a tabela .Fazemos dessa forma porque tem um problema se nao
        // colocar o if a primeira pagina nao recarrega. As paginas so recarregam quando
        // a uma mudança de pagina e como estamos na primeira e ao excluir um lancamento
        // o metodo (onLazyLoad)="aoMudarPagina($event)" nao e chamado pois nao ha mundanca
        // de pagina entao para reniciar a primeira pagina temos que fazaer assim:

        // if (this.tabela.first === 0) {
        // this.pesquisar();
        // } else {
        // this.grid.first = 0;
        // }
        this.pesquisar(this.paginaAtual);
        this.messageService.add({ severity: 'success', detail: 'Lançamento excluido com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
