import http from 'k6/http';
import { check, sleep } from 'k6';
// imports pros graficos
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export let options = {
  stages: [
    { duration: '30s', target: 20 }, 
    { duration: '1m', target: 20 },  
    { duration: '30s', target: 0 },  
  ],
};

export default function () {
  // porta 5500 pq é a do vscode, tem q mudar dps
  const url = 'http://localhost:5500/api/register';
  
  const payload = JSON.stringify({
    email: `k6bot_${__VU}_${__ITER}@gmail.com`, 
    password: 'senhaforte123'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    'Status é 200 ou 201 (Sucesso)': (r) => r.status === 200 || r.status === 201,
    'Tempo de resposta < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1); 
}

// cria os graficos em html na propria pastinha
export function handleSummary(data) {
  return {
    "graficos_medicao_registro.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
