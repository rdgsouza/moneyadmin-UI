import { NaoAutorizadoComponent } from './core/nao-autorizado.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';

const rotas: Routes = [ // Cria as rotas de navegação de paginas
  { path: 'lancamentos', loadChildren: () => import('./lancamentos/lancamentos.module').then(m => m.LancamentosModule) },
  { path: 'pessoas', loadChildren: () => import('./pessoas/pessoas.module').then(m => m.PessoasModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'relatorios', loadChildren: () => import('./relatorios/relatorios.module').then(m => m.RelatoriosModule) },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Se o usuario estiver logado e for digitado somente a url
  // sem passar ex: /lacamentos ele redireciona para pagina dashboard que e a pagina principal
  { path: 'nao-autorizado', component: NaoAutorizadoComponent }, // quando o usuario nao tiver autorização
  // a certo recurso cai nessa pagina
  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },
  { path: '**', redirectTo: 'pagina-nao-encontrada' }, // ** qualquer coisa que não for encontrada na rota de paginas ja configuradas
]; // Array de configuracao de rotas

@NgModule({
  imports: [
    RouterModule.forRoot(rotas)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
