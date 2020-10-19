import { AuthService } from './../../seguranca/auth.service';
import { OnInit } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api/public_api';
import { ConfirmationService } from 'primeng/api';
import { PessoaService, PessoaFiltro } from './../pessoa.service';
import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table/table';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new PessoaFiltro();
  pessoas = [];
  @ViewChild('tabela', { static: true }) tabela: Table;
  paginaAtual = 0;

  constructor(
    private pessoaService: PessoaService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de pessoas');
  }

  // Forma que eu fiz e no outro metodo pesquisar a forma como o Fagner da AlgaWorks fez
  // pesquisar(pagina = 0) {
  //   this.filtro.pagina = pagina;
  //   if (this.filtro.pagina === 0 && this.tabela.first > 4) {
  //     this.tabela.reset();
  //   } else {
  //     this.pessoaService.pesquisar(this.filtro)
  //       .then(resultado => {
  //         this.totalRegistros = resultado.total;
  //         this.pessoas = resultado.pessoas;
  //       })
  //       .catch(erro => this.errorHandler.handle(erro));
  //   }
  // }

  resetarTabela() {
    this.tabela.first = 0;
  }

  pesquisar(pagina = 0) {
    if (pagina === 0) {
      this.resetarTabela();
    }
    this.filtro.pagina = pagina;
    this.pessoaService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    this.paginaAtual = event.first / event.rows;
    this.pesquisar(this.paginaAtual);
  }

  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
        this.pesquisar(this.paginaAtual);
        this.messageService.add({ severity: 'seccess', detail: 'Pessoa excluída com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  alternarStatus(pessoa: any): void {

    const novoStatus = !pessoa.ativo;
    this.pessoaService.mudarStatus(pessoa.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        pessoa.ativo = novoStatus;
        this.messageService.add({ severity: 'success', detail: `Pessoa ${acao} com sucesso!` });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
