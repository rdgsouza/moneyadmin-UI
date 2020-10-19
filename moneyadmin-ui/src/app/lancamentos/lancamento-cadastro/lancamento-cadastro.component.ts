import { AuthService } from './../../seguranca/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { CategoriaService } from './../../categorias/categoria.service';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { Lancamento } from './../../core/model';
import { LancamentoService } from '../lancamento.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = [];
  pessoas = [];
  // lancamento = new Lancamento();
  formulario: FormGroup;
  uploadEmAndamento: boolean;
  ptbr: any;

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private rotaAtivada: ActivatedRoute,
    private rota: Router,
    private title: Title,
    private auth: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.configurarFormulario();
    // tslint:disable-next-line:no-string-literal
    const codigoLancamento = this.rotaAtivada.snapshot.params['codigo'];

    this.title.setTitle('Novo lançamento');

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();

    this.ptbr = {
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
      dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dayNamesMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
        "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sem'
    };
  }

  antesUploadAnexo(event) {
    this.uploadEmAndamento = true;
  }

  aoTerminarUploadAnexo(event) {
    const anexo = event.originalEvent.body;
    this.formulario.patchValue({
      anexo: anexo.nome,
      urlAnexo: anexo.url
    });

    this.uploadEmAndamento = false;
  }
  // Na versão mais atual do PrimeNG quando passamos o objeto event para nosso método,
  // seu tipo é diferente do mostrado na aula.
  // O objeto que recebemos como argumento não tem a propriedade xhr.
  // Para obtermos acesso ao objeto de response, precisamos acessar a propriedade
  //  "originalEvent" e dentro da mesma, acessamos a propriedade "body"
  // Ficando assim:
  // const anexo = event.originalEvent.body;
  // Assim teremos acesso ao objeto da resposta, e o restante do código fica
  // idêntico ao mostrado na aula.

  erroUpload(event) {
    this.messageService.add({ severity: 'error', detail: 'Erro ao tentar anexar arquivo tente novamente.'});

    this.uploadEmAndamento = false;
  }

  removerAnexo() {
    this.formulario.patchValue({
      anexo: null,
      urlAnexo: null
    });
  }

  get nomeAnexo() {
    const nome = this.formulario.get('anexo').value;

    if (nome) {
      return nome.substring(nome.indexOf('_') + 1, nome.length);
    }
    return '';
  }

  get urlUploadAnexo() {
    return this.lancamentoService.urlUploadAnexo();
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: ['RECEITA', Validators.required],
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      descricao: [null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)]],
      valor: [null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      observacao: [],
      anexo: [],
      urlAnexo: []
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : { obrigatoriedade: true });
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : { tamanhoMinimo: { tamanho: valor } };
    };
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
        // this.lancamento = lancamento;
        this.formulario.patchValue(lancamento);
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar() {
    if (this.editando) {
      this.atualizarLancamento();
    } else {
      this.adicionarLancamento();
    }
  }

  atualizarLancamento() {
    this.lancamentoService.atualizar(this.formulario.value)
      .then(lancamento => {
        // this.lancamento = lancamento;
        this.formulario.patchValue(lancamento);
        this.messageService.add({ severity: 'success', detail: 'Lancamento alterado com sucesso!' });
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }


  adicionarLancamento() {
    this.lancamentoService.adicionar(this.formulario.value)
      .then(lancamentoAdicionado => {
        this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

        // form.resetForm();
        // Quando chamamos o resetForm() ele limpa todo o formulario e ate o select button fica
        // desmarcado.
        // Lembrando que o selectButton tem um bind com lancamento.tipo e que por sua vez tem um
        // valor inicial passado que 'RECEITA' so que o reset limpa esse valor passado para o selectButon
        // para resolver ess problema vamos usar o metodo seteTimeout do javascript para que
        // depois que o reset for chamado logo apos sera chamado o setTimeout para instanciar
        // a propiedade lancamento e ao instanciar o lancamento o form traz as propiedades zeradas
        // menos a propriedade tipo.lancamento que estar como bind no ButtonSelect pois ela ja tem um
        // valor padrao passado na sua propiedade que estar na classe Lancametno que e 'RECEITA'
        // setTimeout(function() {
        //   this.lancamento = new Lancamento();
        // }.bind(this), 1); //
        this.rota.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCategorias() {
    return this.categoriaService.listarTodos()
      .then(categorias => {
        this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo }));
        // O metodo map ele itera em todos os elementos do array que estar
        // em categorias e em seguida vai chamar a funcao que foi passada como parametro
        // no metodo map e vai chamar essa função para cada elemento que ele iterou e essa
        // funcao vai fazer as trocas da propiedades que estiverem no array que estar iterando
        // mas mantendo o valor assim que ele termina essa iteracao e muda as propiedades
        // e devovido um array com novas propiedades e essas propiedades label e value
        // e um padrao do primeNg para poder carregar o dropdown
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    return this.pessoaService.listarTodos()
      .then(pessoas => {
        this.pessoas = pessoas.map(p => ({ label: p.nome, value: p.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset();
    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1);
    this.rota.navigate(['/lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.formulario.get('descricao').value}`);
  }
}
