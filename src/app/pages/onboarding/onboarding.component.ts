import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  standalone: false,
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css',
})
export class OnboardingComponent implements OnInit {
  refEletricista: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const ref = params.get('ref');
      if (ref) {
        this.refEletricista = ref;
        localStorage.setItem('tenant_eletricista', ref);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  solicitarOrcamentoCliente() {
    const tenantSalvo = this.refEletricista || localStorage.getItem('tenant_eletricista');
    if (tenantSalvo) {
      this.router.navigate(['/quiz']);
    } else {
      this.router.navigate(['/parceiros']);
    }
  }
}
