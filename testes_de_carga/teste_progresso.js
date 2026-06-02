import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const url = 'https://wfokujwbgwnxtyxuyjih.supabase.co/rest/v1/progresso';

  const payload = JSON.stringify({
    email_jogador: `bot_${__VU}@gmail.com`,
    fase_atual: __ITER,
    pontuacao: Math.floor(Math.random() * 1000)
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'sb_publishable_FYWgjiQ2g8XNjp8U8_xUVQ_PzpTlB1Z',
      'Authorization': 'Bearer sb_publishable_FYWgjiQ2g8XNjp8U8_xUVQ_PzpTlB1Z', 
      'Prefer': 'return=minimal'
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    'Status 201 (Criado com sucesso)': (r) => r.status === 201,
    'Tempo de resposta < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}