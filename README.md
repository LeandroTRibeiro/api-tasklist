<h1 align="center">DevTasks</h1>
<p align="center">Backend de minha lista de tarefas</p>

<p align="center">
 <a href="#demo">Demo</a> •
 <a href="#objetivo">Objetivo</a> •
 <a href="#tecnologias">Tecnologias</a> •
 <a href="#implantacao">Implantação</a> •
 <a href="#funcionalidades">Funcionalidades</a> • 
 <a href="#about">Api endpoints</a> • 
 <a href="#licenca">Licença</a> • 
 <a href="#autor">Autor</a>
</p>

<h4 align="center"> 
	🚧  Em construção...  🚧
</h4>

<h2 id="demo">🕹️ Demo</h2>

API publicada no <a href="https://render.com/">Render</a>: https://api-tasklist.onrender.com (o primeiro acesso pode levar ~40 s, plano gratuito)

<h2 id="objetivo">📖 Objetivo</h2>
<p>Objetivo principal deste projeto foi a criação de um Backend e Frontend que tivésse todas as funcionalidades de um CRUD.</p>

<h2 id="tecnologias">🛠 Tecnologias</h2>

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/) 22+
- [TypeScript](https://www.typescriptlang.org/)
- [Express 5](https://expressjs.com/pt-br/)
- [Mongoose 8](https://mongoosejs.com/)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- [Cors](https://www.npmjs.com/package/cors) e [dotenv](https://www.npmjs.com/package/dotenv)

> Veja o arquivo [package.json](https://github.com/LeandroTRibeiro/api-tasklist/blob/main/package.json)

<h2 id="implantacao">📦 Implantação</h2>

Este projeto é dividido em duas partes:

1. Backend (este repositório)
2. Frontend <a href="https://github.com/LeandroTRibeiro/tasklist-app" target="_blank">Veja o repositório aqui!</a>

💡 Crie um arquivo `.env` (ele não vai para o Git) com:

| Variável | Obrigatória | Descrição |
|---|---|---|
| `MONGO_URL` | sim | Connection string do <a href="https://www.mongodb.com/">MongoDB</a> |
| `CORS_ORIGINS` | não | Endereços do app que podem chamar a API, separados por vírgula (padrão: `http://localhost:5173,http://localhost:4173`) |
| `PORT` | não | Porta do servidor (padrão: 2000) |

🧭 Rodando a API

```bash
# clone o repositório
$ git clone https://github.com/LeandroTRibeiro/api-tasklist
$ cd api-tasklist

# instale as dependências
$ npm install

# desenvolvimento (recarrega ao salvar)
$ npm run dev

# produção
$ npm run build && npm start
```

<h2 id="funcionalidades">⚙️ Funcionalidades</h2>

- [x] Tarefas separadas por aparelho, sem login: cada aparelho usa um ID secreto (UUID) e o banco guarda só o hash dele
- [x] Sincronização para o app offline: o aparelho envia o que mudou e recebe o que mudou no servidor; vence a edição mais recente
- [x] Exclusões sincronizadas (lápides apagadas automaticamente após 30 dias)
- [x] Usar as mesmas tarefas em outro aparelho com o mesmo código
- [x] Limites: título até 120 caracteres, descrição até 500, 500 tarefas por aparelho e 120 requisições por minuto

<h2 id="about">🗃️ Api endpoints</h2>

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | /ping | retorna `{"trocar_imagem": true}` |
| `GET` | /v2/health | acorda o servidor e informa se o banco está conectado: `{"ok": true, "db": true}` |
| `POST` | <a href="#sync">/v2/sync</a> | envia as alterações do aparelho e recebe as do servidor |

<h3 id="sync">POST - /v2/sync</h3>

💡 Envie o cabeçalho `X-Device-Id` com o UUID do aparelho. Em `since`, mande o `serverTime` da última sincronização (ou `null` na primeira). Datas são em milissegundos.

Request:

```json
{
    "since": 1760012345678,
    "changes": [
        {
            "id": "0b9a3c1e-6f0d-4f8e-9a4b-2a7d1c5e8f10",
            "title": "Levar o carro na JF",
            "description": "Troca de óleo e filtros",
            "done": false,
            "deleted": false,
            "createdAt": 1760012000000,
            "updatedAt": 1760012300000
        }
    ]
}
```

Response:

```json
{
    "serverTime": 1760012400000,
    "tasks": [
        {
            "id": "0b9a3c1e-6f0d-4f8e-9a4b-2a7d1c5e8f10",
            "title": "Levar o carro na JF",
            "description": "Troca de óleo e filtros",
            "done": false,
            "deleted": false,
            "createdAt": 1760012000000,
            "updatedAt": 1760012300000
        }
    ],
    "rejected": []
}
```

- `tasks`: tudo o que mudou no servidor desde `since`, incluindo tarefas excluídas (`"deleted": true`). Na primeira sincronização, só as tarefas ativas.
- `rejected`: alterações recusadas e o motivo (ex.: título vazio ou longo demais).

<h2 id="licenca">📝 Licença</h2>

Este projeto está sobre a licença MIT. 
> Veja o arquivo <a href="https://github.com/LeandroTRibeiro/api-tasklist/blob/main/LICENSE" target="_blank">LICENSE</a> para detalhes.

<h2 id="autor">✒️ Autor</h2>

<a href="https://github.com/LeandroTRibeiro">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/111009157?s=400&u=ccf989df0bb9cf41495186f2bc0564c1b03b0d4e&v=4" width="100px;" alt=""/>
 <br />
 <sub><b>Leandro Thiago Ribeiro</b></sub></a> 👋
 <br />
 
[![GitHub Badge](https://img.shields.io/badge/-LeandroTRibeiro-black?style=flat-square&logo=GitHub&logoColor=white&link=https://github.com/LeandroTRibeiro)](https://github.com/LeandroTRibeiro)
[![Linkedin Badge](https://img.shields.io/badge/-LeandroRibeiro-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/leandro-ribeiro-2a8a8b24b/)](https://www.linkedin.com/in/leandro-ribeiro-2a8a8b24b/) 
[![Gmail Badge](https://img.shields.io/badge/-leandrothiago_ribeiro@hotmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:leandrothiago_ribeiro@hotmail.com)](mailto:leandrothiago_ribeiro@hotmail.com)

