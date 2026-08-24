import http from 'node:http';


const porta = 3000;
const tarefas = [
    {id: 1, titulo: 'Resenhar'},
    {id: 2, titulo: 'Farmar Aura'}
];


const server = http.createServer((req, res) => {
    res.setHeader('content-type', 'application/json; charset=utf-8')


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
        
        
        }   catch (error) {
            
        }

        })
    }
});

server.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});