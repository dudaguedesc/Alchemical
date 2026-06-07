import http from 'k6/http';
import { check, sleep } from 'k6';
// imports pros graficos
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export let options = {
  stages: [
    { duration: '30s', target: 50 }, // carga maior
    { duration: '1m', target: 50 },  
    { duration: '30s', target: 0 },  
  ],
};

export default function () {
  // tem q trocar a porta pra do backend tb
  const url = 'http://localhost:5500/api/login'; 
  
  // trocar pra algum email q esteja no banco
  const payload = JSON.stringify({
    email: 'jogador_teste@gmail.com', 
    password: 'senhaforte123'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    'Status é 200 (Login Sucesso)': (r) => r.status === 200,
    'Tempo de resposta < 200ms': (r) => r.timings.duration < 200,
  });
  
  sleep(1); 
}

// html dos graficos
export function handleSummary(data) {
  return {
    "graficos_medicao_login.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
