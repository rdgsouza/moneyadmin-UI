import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { Title } from '@angular/platform-browser';
import localePt from '@angular/common/locales/pt';
import { RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { AuthService } from './../seguranca/auth.service';
import { ErrorHandlerService } from './error-handler.service';
import { LancamentoService } from '../lancamentos/lancamento.service';
import { PessoaService } from '../pessoas/pessoa.service';
import { CategoriaService } from './../categorias/categoria.service';
import { DashboardService } from './../dashboard/dashboard.service';
import { RelatoriosService } from './../relatorios/relatorios.service';
import { NavbarComponent } from './navbar/navbar.component';
import { NaoAutorizadoComponent } from './nao-autorizado.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';

registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent,
    NaoAutorizadoComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,

    ToastModule,
    ConfirmDialogModule,
  ],
  exports: [
    NavbarComponent,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [
    LancamentoService,
    PessoaService,
    CategoriaService,
    DashboardService,
    RelatoriosService,
    ErrorHandlerService,
    AuthService,

    ConfirmationService,
    MessageService,
    JwtHelperService,
    Title,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    // Para fazer a devida configuração de LOCALE
    // A primeira etapa para configurar a localização ao usar a CLI Angular é adicionar
    // o @angular/localizepacote ao projeto. Isso instalará o pacote no seu projeto, além
    // de inicializar o projeto para aproveitar os recursos de localização do Angular.
    // digite o seguinte comando no terminal: ng add @angular/localize
    // Enseguida importe import --> localePt from '@angular/common/locales/pt';
    // E depois adcione a function que importamos atraves do comando ng add @angular/localize
    // essa funtioon sera usada pelo angular para
    // passarmos os parametros de localização do pais --> registerLocaleData(localePt, 'pt');
    // E nao esqueça de cololcar no provider { provide: LOCALE_ID, useValue: 'pt-BR'}
    // para angular prover o serviço LOCALE por valor
    // fonte: https://angular.io/guide/i18n#i18n-pipes

  ]
})
export class CoreModule { }
