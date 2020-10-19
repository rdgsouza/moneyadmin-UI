import { Component } from '@angular/core';
import { Router } from '@angular/router';

/* Esse arquivo .component.ts é um arquivo de controle do componente app.component.ts cada componente tem
o seu.
Basicamente ele armazena a referência do aplicativo quando usado o selector: 'app-root' ele
sera invocado para dizer onde estão as referencias da sua classe como o templateUrl e o
styleUrls dentro desses metadados estarão a referencia de cada arquivo.
*/

@Component({ /*Decoradores são apenas funções que podem ser usadas para adicionar metadados,
  propriedades ou funções às coisas às quais estão anexados.*/

  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { /* A palavra-chave export nos permite fazer uso dessa classe em
                               outras partes do aplicativo */
  constructor(private router: Router) {}

  exibindoNavbar(): boolean {
    // Lógica criada para exibir o menu caso as paginas que estao na rota for /login ou
    // /pagina-nao-encontrada então retorna false com isso nao mostra o componente navbar no
    // arquivo app.component.html
    if (this.router.url === '/login') {
      return false;
    } else if (this.router.url === '/pagina-nao-encontrada') {
      return false;
    } else {
      return true;
    }
  }
}
