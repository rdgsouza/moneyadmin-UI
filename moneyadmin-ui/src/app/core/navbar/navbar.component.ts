import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from './../error-handler.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibindoMenu: boolean = false;

  constructor(
    public auth: AuthService,
    private erroHandler: ErrorHandlerService,
    private rota: Router
  ) {

  }

  ngOnInit() {
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.rota.navigate(['/login']);
      })
      .catch(erro => this.erroHandler.handle(erro));
  }

}
