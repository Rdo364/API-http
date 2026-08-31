import http from 'node:http';
import { URL } from 'node:url';

const porta = 3000;
const tarefas = [
    { id: 1, titulo: 'Resenhar' },
    { id: 2, titulo: 'Farmar Aura' }
];

const server = http.createServer((req, res) => {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    
    const urlobj = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && urlobj.pathname === '/tarefas' && !urlobj.searchParams.has('titulo')) {
        res.statusCode = 200;
        res.end(JSON.stringify(tarefas));
    
    } else if (req.method === 'GET' && urlobj.pathname === '/tarefas/busca') {
        const tituloBusca = urlobj.searchParams.get('titulo') || '';
        const filtradas = tarefas.filter(t => t.titulo.toLowerCase().includes(tituloBusca.toLowerCase()));
        res.statusCode = 200;
        res.end(JSON.stringify(filtradas));

    } else if (req.method === 'DELETE' && urlobj.pathname === '/tarefas') {
        const indexStr = urlobj.searchParams.get('index');
        const index = parseInt(indexStr, 10);

        if (isNaN(index) || index < 0 || index >= tarefas.length) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Índice inválido ou fora dos limites.' }));
            return;
        }

        const removida = tarefas.splice(index, 1);
        res.statusCode = 200;
        res.end(JSON.stringify({ mensagem: 'Tarefa removida com sucesso.', removida }));

    } else if (req.method === 'POST' && urlobj.pathname === '/tarefa') {
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
                res.end(JSON.stringify({ error: 'JSON malformado. Verifique a sintaxe dos dados enviados.' }));
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