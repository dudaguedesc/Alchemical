
import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração do comportamento do teste
export const options = {
    stages: [
        { duration: '30s', target: 20 },  // 20 jogadores em 30 seg
        { duration: '1m', target: 20 },   // 1 minuto
        { duration: '30s', target: 100 }, // 100 jogadores
        { duration: '1m', target: 100 },  // 100 jogadores 1 min
        { duration: '30s', target: 0 },   
    ],
};

export default function () {
const url = 'http://localhost:5500'; //live server do pc do enzo no vscode
    const payload = JSON.stringify({
        username: 'jogador_teste',
        password: 'senha_segura_123',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

 
    const response = http.post(url, payload, params);

    check(response, {
        'status é 200': (r) => r.status === 200,
        'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}