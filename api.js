import http from 'node:http';

const porta = 3000;
const tarefas = [
    { id: 1, titulo: 'Resenhar' },
    { id: 2, titulo: 'Farmar Aura' }
];

const server = http.createServer((req, res) => {
    res.setHeader('content-type', 'application/json; charset=utf-8');

    if (req.method === 'GET' && req.url === '/tarefas') {
        res.statusCode = 200;
        res.end(JSON.stringify(tarefas));
    } else if (req.method === 'POST' && req.url === '/tarefa') {
        let body = '';
        
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const novaTarefa = JSON.parse(body);
                if (!novaTarefa.titulo) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'O campo "titulo" é obrigatório.' }));
                    return;
                }

                const tarefaCriada = {
                    id: tarefas.length + 1,
                    titulo: novaTarefa.titulo
                };
                tarefas.push(tarefaCriada);
                res.statusCode = 201;
                res.end(JSON.stringify(tarefaCriada));

            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Dados inválidos.' }));
            }
        });
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Rota não encontrada.' }));
    }
});

server.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
