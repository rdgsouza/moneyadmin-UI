import { Component, OnInit, ElementRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { DashboardService } from './../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pieChartDataReceita: any;
  pieChartDataDespesa: any;
  lineChartData: any;

  // options = {
  //   tooltips: {
  //     callbacks: {
  //       title: (tooltipItem) => `Dia ${tooltipItem[0].label}`,
  //       label: (tooltipItem, data) => {
  //         const dataset = data.datasets[tooltipItem.datasetIndex];
  //         const valor = dataset.data[tooltipItem.index];
  //         const label = dataset.label ? (dataset.label + ' R$') : '';
  //         // Caso queira colocar dois pontos e um espaço depois do cifrão coloque assim:
  //         // const label = dataset.label ? (dataset.label + ': ') : '';
  //         return label + this.decimalPipe.transform(valor, '1.2-2');
  //       }
  //     }
  //   }
  // };

  defaultChartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const valor = dataset.data[tooltipItem.index];
          const label = dataset.label ? (dataset.label + ' R$') : '';

          return label + this.decimalPipe.transform(valor, '1.2-2');
        }
      }
    }
  };

  pieChartOptions = this.defaultChartOptions;

  lineChartOptions = {
    tooltips: {
      callbacks: {
        ...this.defaultChartOptions.tooltips.callbacks,
        title: (tooltipItem) => {
          return `Dia ${tooltipItem[0].label}`;
        }
      }
    }
  };

  //   No arquivo TypeScript eu criei três variáveis:
  // - defaultChartOptions: opções padrão para os gráficos;
  // - pieChartOptions: opções para o gráfico de pizza. Estas são iguais às opções padrão;
  // - lineChartOptions: opções para o gráfico de linha. Neste caso há a concatenação das
  //  opções padrão (por meio do spread operator), no tooltips.callback, e da personalização
  //   do title.

  // Se quiser saber mais sobre o spread operator, segue a documentação da
  //  Mozilla: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_syntax

  constructor(
    private dashboardService: DashboardService,
    private decimalPipe: DecimalPipe,
    private elementRef: ElementRef,
  ) {
    // Vamos usar o elementRef para tirar o background que colocamos anteriormente e
    // setar a padrão que é branca passando duas aspas simples que significa um valor
    // vazio.
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '';
  }

  ngOnInit() {
    this.configurarGraficoPizzaReceita();
    this.configurarGraficoPizzaDespesa();
    this.configurarGraficoLinha();
  }

  configurarGraficoPizzaReceita() {
    this.dashboardService.lancamentosReceitaPorCategoria()
      .then(dados => {
        this.pieChartDataReceita = {
          labels: dados.map(dado => dado.categoria.nome),
          datasets: [
            {
              label: ' ',
              data: dados.map(dado => dado.total),
              backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6',
                '#DD4477', '#3366CC', '#DC3912']
            }
          ]
        };
      });
  }

  configurarGraficoPizzaDespesa() {
    this.dashboardService.lancamentosDespesaPorCategoria()
      .then(dados => {
        this.pieChartDataDespesa = {
          labels: dados.map(dado => dado.categoria.nome),
          datasets: [
            {
              label: ' ',
              data: dados.map(dado => dado.total),
              backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6',
                '#DD4477', '#3366CC', '#DC3912']
            }
          ]
        };
      });
  }

  configurarGraficoLinha() {
    this.dashboardService.lancamentosPorDia()
      .then(dados => {
        const diasDoMes = this.configurarDiasMes();
        const totaisReceitas = this.totaisPorCadaDiaMes(
          dados.filter(dado => dado.tipo === 'RECEITA'), diasDoMes);
        const totaisDespesas = this.totaisPorCadaDiaMes(
          dados.filter(dado => dado.tipo === 'DESPESA'), diasDoMes);
        this.lineChartData = {
          labels: diasDoMes,
          datasets: [
            {
              label: 'Receitas',
              data: totaisReceitas,
              borderColor: '#3366CC'
            }, {
              label: 'Despesas',
              data: totaisDespesas,
              borderColor: '#D62B00'
            }
          ]
        };
      });
  }

  private totaisPorCadaDiaMes(dados, diasDoMes) {
    const totais: number[] = [];
    for (const dia of diasDoMes) {
      let total = 0;

      for (const dado of dados) {
        if (dado.dia.getDate() === dia) {
          total = dado.total;

          break;
        }
      }

      totais.push(total);
    }

    return totais;
  }

  private configurarDiasMes() {
    const mesReferencia = new Date();
    mesReferencia.setMonth(mesReferencia.getMonth() + 1);
    mesReferencia.setDate(0);

    const quantidade = mesReferencia.getDate();

    const dias: number[] = [];

    for (let i = 1; i <= quantidade; i++) {

      dias.push(i);
    }

    return dias;
  }

}
