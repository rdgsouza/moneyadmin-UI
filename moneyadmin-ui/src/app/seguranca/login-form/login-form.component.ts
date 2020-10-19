import { Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  // encapsulation: ViewEncapsulation.None --> Outra forma de colocar background
  // na pagina SPA Angular despois de ter colocado essa propiedade basta ir no style.css
  // e colocar a cor do background desejado
})
export class LoginFormComponent implements OnInit, AfterViewInit {

  constructor(
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private rota: Router,
    private title: Title,
    private elementRef: ElementRef,
  ) { }

  // Metodo para colocar style background em toda pagina do SPA do Angular
  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#F0F2F5';
  }

  ngOnInit(): void {
    this.title.setTitle('MoneyAdmin');
  }

  login(usuario: string, senha: string) {
    this.auth.login(usuario, senha)
      .then(() => {
        this.rota.navigate(['/dashboard']);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }

}
