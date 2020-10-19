import { AuthService } from './../seguranca/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MessageService } from 'primeng/api';



import { NotAuthenticatedError } from './../seguranca/money-http-interceptor';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private messageService: MessageService,
    private rota: Router,
    private auth: AuthService) { }

  handle(errorResponse: any) {

    let msg: string;

    if (typeof errorResponse === 'string') {
      msg = errorResponse;

    } else if (errorResponse instanceof HttpErrorResponse
      && errorResponse.status === 404) { // O erro 404 aparece quando o angular nao consegue
      // o endereço da rota de navegação especificada pelo usuario no navegador
      this.rota.navigate(['/pagina-nao-encontrada']); // retornamos a pagina com a fraase
      // pagina nao encontrada
      return;

      // } else if (errorResponse instanceof HttpErrorResponse
      //   && errorResponse.status === 401) {

      //   return this.auth.obterNovoAccessToken();

    } else if (errorResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou!';
      this.rota.navigate(['/login']);

    } else if (errorResponse instanceof HttpErrorResponse
      && errorResponse.status >= 400 && errorResponse.status <= 499) {
      let errors;
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (errorResponse.status === 403) {
        msg = 'Você não tem permissão para executar essa ação.';
      }

      try {
        errors = errorResponse.error;
        msg = errors[0].mensagemUsuario;
      } catch (e) { }

      console.error('Ocorreu um erro', errorResponse);

    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro', errorResponse);
    }
    this.messageService.add({ severity: 'error', detail: msg });
  }
}

// Fiz diferente nessa parte:

//   && errorResponse.status >= 400 && errorResponse.status <= 499) {

//   const errors = errorResponse.error; --> Criei uma constante e passei o objeto
//   errorResponse.error para pegar o error
//   msg = errors[0].mensagemUsuario;  --> com o error em maos vamos pegar o erro que estar
//   na posicao 0 e passando como referencia mensagemUsuario

//   } else {
//   msg = 'Erro ao processar serviço remoto. Tente novamente.';
//   console.error('Ocorreu um erro', errorResponse);
//   }
//    this.toasty.error(msg);
//    }
// }
