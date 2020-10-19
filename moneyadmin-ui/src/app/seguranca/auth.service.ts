import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl: string;
  tokenRevokeUrl: string;
  jwtPayload: any;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
    this.tokenRevokeUrl = `${environment.apiUrl}/tokens/revoke`;
    this.carregarToken();
    // Não precisamos armazenar o jwtPayload no localStorage porque precisamos
    // somente os dados que foram decodificados nele entao para não perdemos esses dados
    // toda vez que a classe auth.service.ts for inicializada precisamos carregar ele no
    // no construtor da classe para isso usamos o metodo carredarToken()
  }

  login(usuario: string, senha: string): Promise<void> {

    const headers = new HttpHeaders().append('Authorization',
      'Basic YW5ndWxhcjpAbmd1bEByMA==').
      append('Content-Type', 'application/x-www-form-urlencoded');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        // tslint:disable-next-line:no-string-literal
        this.armazenarToken(response['access_token']);
        // tslint:disable-next-line:no-string-literal
      })
      .catch(response => {
        const responseError = response.error;
        if (response.status === 400) {
          if (responseError.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida');
          }
        }
        return Promise.reject(response);
      });
  }

  obterNovoAccessToken(): Promise<void> {

    const headers = new HttpHeaders().append('Authorization',
      'Basic YW5ndWxhcjpAbmd1bEByMA==').
      append('Content-Type', 'application/x-www-form-urlencoded');

    const body = 'grant_type=refresh_token';
    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        // tslint:disable-next-line:no-string-literal
        this.armazenarToken(response['access_token']);
        console.log('Novo Acess token criado!');
        return Promise.resolve(null); // O metodo resolve - Praticamente pergunta: É pra
        // resolver alguma coisa no retorno ? (null) significa nao resolva nada o que vinher
        // vai ser essa resposta mesmo.
      })
      .catch(response => {
        console.error('Erro ao renovar token.', response);
        return Promise.resolve(null);
      });
  }

  limparAcessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  logout() {
    return this.http.delete(this.tokenRevokeUrl, { withCredentials: true })
      .toPromise()
      .then(() => {
        this.limparAcessToken();
      });
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
    // Símbolo ! é chamado de negação. Este operador retorna true se o operando tem o
    // valor false, e retorna false se o operando o valor true.
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }
    return false;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.armazenarToken(token);
    }
  }
}
