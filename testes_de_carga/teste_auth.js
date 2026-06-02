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
  const url = 'https://wfokujwbgwnxtyxuyjih.supabase.co/auth/v1/signup';
  
  const payload = JSON.stringify({
    email: `k6bot_${__VU}_${__ITER}@gmail.com`, 
    password: 'senhaforte123'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'sb_publishable_FYWgjiQ2g8XNjp8U8_xUVQ_PzpTlB1Z',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    'Status é 200 (Sucesso)': (r) => r.status === 200,
    'Tempo de resposta < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1); 
}