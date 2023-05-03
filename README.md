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

<h2 id="demo">🕹️ Demo</h2>

Link do demo da aplicação publicado no <a href="https://render.com/">Render</a> - https://api-tasklist.onrender.com

<h2 id="objetivo">📖 Objetivo</h2>
<p>Objetivo principal deste projeto foi a criação de um Backend e Frontend que tivésse todas as funcionalidades de um CRUD.</p>

<h2 id="tecnologias">🛠 Tecnologias</h2>

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Mongoose](https://mongoosejs.com/)
- [Express](https://expressjs.com/pt-br/)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Validator](https://www.npmjs.com/package/validator)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Body Parser](https://www.npmjs.com/package/body-parser)
- [Cors](https://www.npmjs.com/package/cors)

> Veja o arquivo  [package.json](https://github.com/LeandroTRibeiro/api-tasklist/blob/main/package.json)

<h2 id="implantacao">📦 Implantação</h2>

Este projeto é dividio em duas partes:

1. Backend 
2. Frontend <a href="https://github.com/LeandroTRibeiro/tasklist-app" target="_blank">Veja o repositório aqui!</a>

💡 O Backend precisa de um arquivo ".env" com a chave "MONGO_URL" de seu banco de dados <a href="https://www.mongodb.com/">MongoDB</a> para funcionar.

🧭 Rodando a aplicação web (Backend)

```bash
# Pré-requisitos globais
$ npm i -g nodemon typescript ts-node

# clone o repositório
$ git clone https://github.com/LeandroTRibeiro/api-tasklist

# Acesse a pasta do projeto no seu terminal/cmd
$ cd api-tasklist

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run start-dev
```

<h2 id="funcionalidades">⚙️ Funcionalidades</h2>

Após o usuário acessar a aplicação:
- [x] Criar uma tarefa com ou sem descrição da mesma 
- [x] Editar uma tarefa
- [x] Deletar uma tarefa
- [x] Marcar uma tarefa como feita
- [x] Pesquisar tarefas, pelo titulo ou parte dele
- [x] Ordenar as terefas por mais antigas ou recentes
- [x] Mudar o tema da aplicação

<h2 id="about">🗃️ Api endpoints</h2>

A Api recebe informações pelo query params e por JSON.

| Methods | Endpoint | Descrição |
|--------:|---------:|----------:|
|`GET`    | /ping    | retorna: ```{"pong":"true"}```|
|`GET`    | <a href="#tasks">/tasks</a>   | retorna todas as tarefas |
|`GET`    | <a href="#search">/task/:query<a/> | retorna todas as tarefas com o mesmo nome ou parte dele |
|`GET`    | <a href="#searchid">/task/show/:id</a> | retorna a tarefa com o mesmo id |
|`POST`   | <a href="#add">/tasks</a> | adiciona uma nova tarefa |
|`PUT`    | <a href="#put">/task/:id</a> | faz o update da tarefa selecionada pelo id |
|`DEL`    | <a href="#del">/task/:id</a> | deleta a tarefa selecionada pelo id |

<h3 id="tasks">GET - /tasks</h3>
Response:

```
{
    "tasks": [
        {
            "_id": "63bea9d9edf64f4ce043c8ba",
            "title": "DevTasks",
            "done": true,
            "description": "Terminar o Projeto",
            "__v": 0
        },
        {
            "_id": "63bea9ecedf64f4ce043c8be",
            "title": "DevChat",
            "done": false,
            "description": "Terminar o projeto",
            "__v": 0
        },
        {
            "_id": "63beaa00edf64f4ce043c8c2",
            "title": "NodeJs",
            "done": false,
            "description": "Criar controllers",
            "__v": 0
        }
    ]
}

```
___

<h3 id="search">GET - /tasks/:query</h3>
💡 Mandar informações de pesquisa pelo query params. Ex: /tasks/Node
<br>Response:

```
{
    "task": [
        {
            "_id": "63beaa00edf64f4ce043c8c2",
            "title": "NodeJs",
            "done": false,
            "description": "Terminar Curso de Node",
            "__v": 0
        }
    ]
}
```
___

<h3 id="searchid">GET - /task/show/:id</h3>
💡 Mandar informações de pesquisa pelo query params. Ex: /task/show/63beaa00edf64f4ce043c8c2
<br>Response:

```
{
    "task": {
        "_id": "63beaa00edf64f4ce043c8c2",
        "title": "NodeJs",
        "done": false,
        "description": "Terminar Curso de Node",
        "__v": 0
    }
}
```
___

<h3 id="add">POST - /task</h3>
💡 Mandar informações da requisição por JSON, o campo "description" não é obrigatório para criação de uma nova tarefa e por padrão todas as novas tarefas começam com o campo "done" como false.
<br>Request:

```
{
    "title": "Nova Tarefa",
    "description": "Fazer tarefa"
}
```

<br>Response:

```
{
    "newTask": {
        "_id": "63cedbaa716e6e1333b18130",
        "title": "Nova Tarefa",
        "done": false,
        "description": "Fazer tarefa",
        "__v": 0
    }
}
```
___

<h3 id="put">PUT - /task/:id</h3>
💡 Mandar informações de pesquisa pelo id no query params, e updates por JSON. Ex: /task/63cedbaa716e6e1333b18130

<br>Request:

```
{
    "title": "Nova Tarefa Updated",
    "description": "Fazer tarefa Updated",
    "done": true
}
```

<br>Response:

```
{
    "task": {
        "_id": "63cedbaa716e6e1333b18130",
        "title": "Nova Tarefa Updated",
        "done": true,
        "description": "Fazer tarefa Updated",
        "__v": 0
    }
}
```
___

<h3 id="del">DEL - /task/:id</h3>
💡 Mandar informações de pesquisa pelo id no query params. Ex: /task/63cedbaa716e6e1333b18130

<br>Response:

```
{}
```
___
	
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
[![Linkedin Badge](https://img.shields.io/badge/-LeandroRibeiro-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/ribeiro-leandro/)](https://www.linkedin.com/in/ribeiro-leandro/) 
[![Gmail Badge](https://img.shields.io/badge/-leandrothiago_ribeiro@hotmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:leandrothiago_ribeiro@hotmail.com)](mailto:leandrothiago_ribeiro@hotmail.com)

