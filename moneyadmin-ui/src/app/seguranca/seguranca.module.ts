import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { AuthGuard } from './auth.guard';
import { LoginFormComponent } from './login-form/login-form.component';
import { MoneyHttpInterceptor } from './money-http-interceptor';
import { SegurancaRoutingModule } from './seguranca-routing.module';

// Nessa versão da biblioteca de JWT, a integração com o componente HttpClient se dá de
// forma muito transparente, não sendo necessário utilizarmos mais o Wrapper
// citado pelo Thiago.
// Porém, precisamos especificar de onde será obtido o valor do nosso token,
// mesmo que estivermos seguindo o padrão de salvá-lo no localStorage como "token".
// Para isso, precisaremos, no seguranca.module.ts, adicionar algumas configurações.

// Declaramos uma função abaixo chamada tokenGetter() para obter o token.
// Ela tem uma função que irá retornar o token,
// ela não recebe argumentos e retorna uma string:

export function tokenGetter(): string {

  if (this.auth.isAccessTokenInvalido()) {

    return this.auth.obterNovoAccessToken();

  } else {

    return localStorage.getItem('token');
  }

}
@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    FormsModule,

    InputTextModule,
    ButtonModule,

    SegurancaRoutingModule,

    // Agora declaramos esta função abaixo, nas propriedades de configuração do JwtModule:
    JwtModule.forRoot({
      config: {

        // tslint:disable-next-line:object-literal-shorthand

        // tokenGetter: tokenGetter // Dentro do config do JwtModule criamos a propiedade

        // tokenGetter que recebe o metodo tokenGetter que indicara qual token pegar.
        // Quais URLs interceptar?
        // Para que funcione a interceptação das requisições, e para que seja adicionado
        // o token nos Headers, precisamos informar quais URLs devemos intereceptar, e quais
        // devemos ignorar.
        // Nossa configuração ficará assim:

        // whitelistedDomains: ['localhost:8080'],
        // blacklistedRoutes: ['http://localhost:8080/oauth/token']

        // Com isso, indicamos que no domínio "localhost:8080", todas as requisições serão
        // interceptadas e o token será adicionado no header.
        // Já para "http://localhost:8080/oauth/token" não ocorrerá nenhuma interceptação,
        // pois neste endpoint, não utilizamos o token armazendo no localStorage, e sim
        // enviaremos a autenticação básica de segurança que nossa api precisa para retornar
        // um token como vimos em aulas anteriores.
        // Obs: Quando for feita uma requisição em um recurso da nossa api ex:
        // return this.http.get(`${this.lancamentosUrl}?resumo`, { params })
        // o header contendo o token que nossa api precisa para poder poder retornar os dados
        // de um recurso é adionado de forma automatica pelo JwtModule atraves da configuração
        // que fizemos acima!
      }
    })
  ],
  providers: [
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MoneyHttpInterceptor,
      multi: true
    },
    AuthGuard
  ]
})

export class SegurancaModule {
  constructor() { }

}
