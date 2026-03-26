# Teste Técnico - Desenvolvedor Fullstack Pleno

## [1] Lógica (IMPLEMENTADO COMO UM ENDPOINT DA API, EM /logica)

### **ENDPOINT: /logica**
### **URL completa: http://localhost:3005/logica**


Implemente uma função que receba uma lista de números inteiros e retorne:

* A soma dos números pares
* A média dos números ímpares
* Ignore valores inválidos (null, string, undefined)

**Exemplo de entrada:**

```json
[1, 2, 3, 4, 5, "a", null]
```


## [2] Conceitos (resposta escrita curta)

### Responda brevemente:
- ### `1. Diferença entre REST e GraphQL`<br>
A principal diferença entre o REST e o GraphQL é que o REST tem vários endpoints, e eles retornam uma resposta com dados predefinidos pelo servidor, enquanto o Graphql tem apenas um único endpoint, e possibilita o cliente escolher apenas os dados que deseja receber.

- ### `2. O que é transação em banco de dados`<br>
Transação no banco de dados é um conjunto de operações são executadas como uma única unidade, garantindo que todas sejam concluídas ou nenhuma seja aplicada, se algum ponto falhar tudo é revertido.

- ### `3. Diferença entre autenticação e autorização`<br>
A autenticação serve para verificar quem o usuário é, normalmente através de um email e senha, enquanto a autorização é para definir o nível de acesso/permissões do usuário, podendo permitir ou impedir o acesso de certos módulos do sistema, ou páginas especifícas.

- ### `4. Quando usar cache e quando evitar`<br>
O cache deve ser utilizado para salvar dados que não costumam mudar tão frequentemente, desse modo, melhorando a perfomance do cliente, e ele deve ser evitado de ser utilizado quando existem dados que precisam sempre estar atualizados ou quando podem gerar algum risco de inconsistência entre os dados puxados do banco e do cache.

## Como rodar o projeto

### Com Docker:

Na raiz do projeto execute:

```bash
docker compose up --build
```

Depois acesse o frontend em http://localhost:3000 e a API em http://localhost:3005.

### Sem Docker:

Abra a pasta backend e frontend em terminais separados.

Na pasta backend:

```bash
cd backend
npm install
npm run dev
```

A API ficará em http://localhost:3005.

Na pasta frontend:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará em http://localhost:3000.


## Decisões técnicas tomadas

- Stacks escolhidas: Next.js (Typescript) + Node.js + TailwindCSS + SQLite 
- Autenticação: JWT
- Testes unitários: Vitest
- Docker

Optei por utilizar o SQLite pela simplicidade do projeto, e o uso do Tailwind para responsividade. Ademais, separei o frontend e backend de acordo com a convenção de uso do Next.js com Node.js, além de utilizar o express-validator como middleware para validações, e utilizei a autenticação com JWT para cumprir parte do escopo do projeto.

## O que eu melhoraria se tivesse mais tempo

Eu criaria uma pipeline pelo github actions, para validar testes, buildar automaticamente a aplicação e já realizar o deploy a cada commit que fosse feito.

## Pontos fortes e limitações da solução

O principal ponto forte é a simplicidade na execução, com uma arquitetura direta, e o suporte para rodar com ou sem Docker. Como limitação, há espaço para criação de testes automatizados para o frontend, e um fluxo de deploy integrado com uma pipeline de testes.
