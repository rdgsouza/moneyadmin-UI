import { NgForm } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

import { Contato } from 'src/app/core/model';

@Component({
  selector: 'app-pessoa-cadastro-contato',
  templateUrl: './pessoa-cadastro-contato.component.html',
  styleUrls: ['./pessoa-cadastro-contato.component.css']
})
export class PessoaCadastroContatoComponent implements OnInit {

  @Input() contatos: Array<Contato>;
  contato: Contato;
  exibindoFormularioContato = false;
  contatoIndex: number;

  constructor() { }

  ngOnInit(): void {
  }

  prepararNovoContato() {
    this.exibindoFormularioContato = true;
    this.contato = new Contato();
    this.contatoIndex = this.contatos.length; // Configuramos sempre para o ultimo index
  }

  prepararEdicaoContato(contato: Contato, index: number) {
    this.contato = this.clonarContato(contato);
    this.exibindoFormularioContato = true;
    this.contatoIndex = index; // Configuramos para o index selecionado que foi
    // passado no parametro
  }

  confirmarContato(frm: NgForm) {
    this.contatos[this.contatoIndex] = this.clonarContato(this.contato);

    this.exibindoFormularioContato = false;
    frm.reset();
  }

  removerContato(index: number) {

    this.contatos.splice(index, 1); // primeiro parametro e o index do array e o segundo
    // e quantidade de elementos que eu quero remover desse array passamos um porque
    // so queremos remover 1 regeistro referente ao index passado no primeiro parametro
  }

  clonarContato(contato: Contato): Contato {
    return new Contato(contato.codigo,
      contato.nome, contato.email, contato.telefone);
  }

  get editando() {
    return this.contato && this.contato.codigo;
  }

}
