import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare var MercadoPago: any;

@Component({
  selector: 'app-assinatura',
  templateUrl: './assinatura.html',
  styleUrls: ['./assinatura.css'],
  standalone: false
})
export class AssinaturaComponent implements OnInit {
  
  loading = false;
  checkoutActive = false;
  mp: any;
  erroMP: string = '';
  private valorPendente: number = 0;

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.inicializarMP();
  }

  inicializarMP() {
    // Verifica se o SDK do Mercado Pago já carregou
    if (typeof MercadoPago === 'undefined') {
      console.warn('SDK do Mercado Pago ainda não carregou. Tentando novamente em 1s...');
      setTimeout(() => this.inicializarMP(), 1000);
      return;
    }

    try {
      this.mp = new MercadoPago(environment.mercadoPagoPublicKey, {
        locale: 'pt-BR'
      });
      console.log('Mercado Pago SDK inicializado com sucesso!');
    } catch (e) {
      console.error('Erro ao inicializar Mercado Pago:', e);
      this.erroMP = 'Erro ao inicializar o SDK do Mercado Pago.';
    }
  }

  iniciarPagamento(valor: number, descricao: string) {
    if (!this.mp) {
      this.erroMP = 'SDK do Mercado Pago não está pronto. Aguarde...';
      this.inicializarMP();
      return;
    }

    this.loading = true;
    this.erroMP = '';
    this.valorPendente = valor;
    
    setTimeout(() => {
      this.loading = false;
      this.checkoutActive = true;
      // Força o Angular a processar o *ngIf e criar o DOM
      this.cdRef.detectChanges();
      // Agora tenta renderizar com retry
      this.tentarRenderizarBrick(valor, 0);
    }, 1000);
  }

  private tentarRenderizarBrick(valor: number, tentativa: number) {
    const container = document.getElementById('wallet_container');
    if (!container) {
      if (tentativa < 10) {
        // Tenta de novo em 200ms (máx 10 tentativas = 2s)
        setTimeout(() => this.tentarRenderizarBrick(valor, tentativa + 1), 200);
      } else {
        console.error('Container wallet_container não encontrado após 10 tentativas');
        this.erroMP = 'Erro ao abrir o formulário de pagamento. Tente novamente.';
      }
      return;
    }
    this.renderizarBrick(valor);
  }

  renderizarBrick(valor: number) {
    const container = document.getElementById('wallet_container');
    if (!container) return;
    container.innerHTML = '';

    try {
      this.mp.bricks().create("payment", "wallet_container", {
        initialization: {
          amount: valor,
        },
        customization: {
          paymentMethods: {
            ticket: "all",
            bankTransfer: "all",
            creditCard: "all",
            debitCard: "all",
            mercadoPago: "all",
          },
        },
        callbacks: {
          onReady: () => {
            console.log("Brick de Pagamento carregado com sucesso!");
          },
          onSubmit: ({ selectedPaymentMethod, formData }: any) => {
            console.log("Dados a enviar para API:", formData);
            return new Promise<void>((resolve, reject) => {
              this.http.post(environment.apiUrl + '/api/payments/process', formData).subscribe({
                next: (res: any) => {
                  console.log("Pagamento processado:", res);
                  resolve();
                  
                  // O Brick de pagamento não mostra o QR Code do PIX sozinho.
                  // Precisamos chamar o Brick de "Status Screen" com o ID do pagamento gerado.
                  if (res.id) {
                    this.mostrarTelaDeStatus(res.id);
                  } else {
                    if (res.status === 'approved') {
                      alert("Pagamento aprovado com sucesso!");
                      this.fecharCheckout();
                    }
                  }
                },
                error: (err) => {
                  console.error("Erro ao processar pagamento:", err);
                  reject();
                  this.erroMP = 'Erro ao processar o pagamento com a API.';
                }
              });
            });
          },
          onError: (error: any) => {
            console.error("Erro no Brick:", error);
            this.erroMP = 'Falha ao carregar o formulário de pagamento.';
          },
        },
      });
    } catch (e) {
      console.error("Erro ao inicializar MP Brick:", e);
      this.erroMP = 'Erro ao criar o componente de pagamento.';
    }
  }

  mostrarTelaDeStatus(paymentId: string) {
    const container = document.getElementById('wallet_container');
    if (!container) return;
    
    // Limpa o Brick de pagamento atual
    container.innerHTML = '';

    try {
      this.mp.bricks().create("statusScreen", "wallet_container", {
        initialization: {
          paymentId: paymentId,
        },
        customization: {
          visual: {
            hideStatusDetails: false,
            hideTransactionDate: false,
            style: {
              theme: 'default', // 'default' | 'dark' | 'bootstrap' | 'flat'
            }
          }
        },
        callbacks: {
          onReady: () => {
            console.log("Status Screen carregado!");
          },
          onError: (error: any) => {
            console.error("Erro no Status Screen:", error);
          },
        },
      });
    } catch (e) {
      console.error("Erro ao inicializar Status Screen:", e);
    }
  }

  fecharCheckout() {
    this.checkoutActive = false;
    this.erroMP = '';
  }
}
