import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-message',
  template: `
  <div *ngIf="temErro()" class="ui-messages ui-messages-error">
     {{ text }}
 </div>
  `,
  styles: [`

  .ui-messages {
    margin-top: 7px;
    padding: 6px;
    margin-bottom: -6px;
  }
  /*
  OBS: Caso queira trocar a cor de fundo da mensagem e colocar borda na mensagem
  .ui-messages.ui-messages-error {
    background-color: #ffebe8;
    color: #000000;
    border: 1px solid #f53e50;
  }
*/
`]
})
export class MessageComponent {

  @Input() error: string;
  @Input() control: FormControl;
  @Input() text: string;

  temErro(): boolean {
    return this.control.hasError(this.error) && this.control.dirty;
  }

}
