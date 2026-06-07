import http from 'k6/http';
import { check, sleep } from 'k6';
// import pros graficos
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
  // msm coisa do outro teste, porta 5500 do live server
  const url = 'http://localhost:5500/api/progresso';

  const payload = JSON.stringify({
    email_jogador: `bot_${__VU}@gmail.com`,
    fase_atual: __ITER,
    pontuacao: Math.floor(Math.random() * 1000)
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    'Status 200 ou 201 (Salvo com sucesso)': (r) => r.status === 200 || r.status === 201,
    'Tempo de resposta < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}

// html do grafico
export function handleSummary(data) {
  return {
    "graficos_medicao_progresso.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
