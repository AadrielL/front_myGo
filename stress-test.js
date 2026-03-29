import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 50 },  // Sobe para 50 usuários em 30 seg
    { duration: '1m', target: 200 },  // Sobe para 200 usuários em 1 min
    { duration: '30s', target: 1000 }, // O pico de 1000 usuários
    { duration: '30s', target: 0 },    // Desce para 0 (resfriamento)
  ],
};

export default function () {
  const url = 'http://localhost:8081/api/quiz/gerar';
  const payload = JSON.stringify({
    nomeCliente: 'Teste Carga',
    metragemM2: 100,
    complexidade: 'RESIDENCIAL'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': '9839be35e537b9d52f59847cbe2c8bc2137c0b278eda29138bf67e53601a0999'
    },
  };

  http.post(url, payload, params);
  sleep(1); 
}