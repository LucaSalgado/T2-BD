
# API de Tags
Esta é uma API para gerenciar tags associadas a diferentes entidades em uma competição.

## Endpoints

### GET `/tag/api/contest/:contestId/tags/:entityType/:entityId`
Este endpoint retorna as tags associadas à entidade especificada na competição.

#### Parâmetros
-  `contestId`: O ID da competição.
-  `entityType`: O tipo da entidade (ex: `problem`, `language`, `site`, `site/user`).
-  `entityId`: O ID da entidade.

#### Consultas
Você pode adicionar as seguintes consultas à URL para filtrar as tags:
-  `tagId`: Filtra pelo ID da tag.
-  `tagName`: Filtra pelo nome da tag.
-  `tagValue`: Filtra pelo valor da tag.

### POST `/api/contest/:contestId/tags`
Este endpoint permite adicionar novas tags para as entidades na competição.

#### Corpo da Requisição
```
{
  "entityTag": [
    {
      "entityType": "problem",
      "entityId": "2006",
      "tag": [
        {
          "id": 1,
          "name": "group",
          "value": "silberschatz"
        },
        {
          "id": 2,
          "name": "level",
          "value": "easy"
        }
      ]
    },
    {
      "entityType": "language",
      "entityId": "mysql",
      "tag": [
        {
          "id": 1,
          "name": "group",
          "value": "relational"
        }
      ]
    }
  ]
}
```
### PUT /api/contest/:contestId/tags

Este endpoint permite atualizar as tags existentes para as entidades na competição.

#### Corpo da Requisição
```
{
  "entityTag": [
    {
      "entityType": "problem",
      "entityId": "2006",
      "tag": [
        {
          "id": 1,
          "name": "group",
          "value": "database"
        },
        {
          "id": 2,
          "name": "level",
          "value": "medium"
        }
      ]
    }
  ]
}
```

### DELETE `/api/contest/:contestId/tags`
Este endpoint permite excluir as tags associadas às entidades na competição.

#### Corpo da Requisição
```
{
  "entityTag": [
    {
      "entityType": "problem",
      "entityId": "2006",
      "tag": [
        {
          "id": 1,
          "name": "group",
          "value": "silberschatz"
        }
      ]
    }
  ]
}
```
## Configuração do Banco de Dados

Certifique-se de ter um banco de dados PostgreSQL configurado corretamente com as seguintes informações:

-   Usuário: `postgres`
-   Host: `boca-db`
-   Banco de Dados: `bocadb`
-   Senha: `superpass`
-   Porta: `5432`

## Dependências do projeto

* [Docker Desktop](https://www.docker.com)
* [Git](https://git-scm.com)

### Para execução local

* [Node.js](https://nodejs.org/en)
* NPM

## Como Executar

1.  Clone este repositório: `git clone https://github.com/LucaSalgado/T2-BD.git`
2.  Execute o comando ***limpar*** antes de executar qualquer comando do projeto para garantir que não haja volume existente e não seja criada a tabela **tagstable**.
3.  Execute o comando *start* do script `executar.sh` para iniciar:
	- `./executar.sh start` no linux
	- `Bash executar.sh start` no windows powershell
4.  Execute o comando *stop* do script `executar.sh` para parar:
	- `./executar.sh stop` no linux
	- `Bash executar.sh stop` no windows powershell
5.  Execute o comando *limpar* do script `executar.sh` para remover os containers, imagens e volumes sem prune:
	- `./executar.sh limpar` no linux
	- `Bash executar.sh limpar` no windows powershell
6.  Execute o comando *restart* do script `executar.sh` para parar a execução e iniciar novamente automaticamente:
- `./executar.sh restart` no linux
- `Bash executar.sh restart` no windows powershell
> O comando *restart* é indicado para o uso durante o desenvolvimento, pois assim facilita na hora de atualizar a execução dos containers com as alterações feitas.

## Mini Relatório

Uma decisão tomada durante o inicio do desenvolvimento do projeto foi a criação do arquivo `executar.sh` para poder simplificar o processo de execução dos comandos do **Docker** que eram muito grandes

Um problema encontrado foi o *entityType: **site/user*** que era interpretado pelo **express.js** como dois parâmetros ao invés de um único. Após olhar a documentação do **express.js** nó vimos que o *router paths* internamente usa um pacote chamado **path-to-regexp** que utiliza expressões regulares para determinar a rota chamada. Com isso nós chegamos a conclusão que poderiamos usar uma expressão regular (ou regex) para que o **site/user** fosse interpretado como um único parâmetro.

Foi decidido que erros durante a execução seriam retornados ao usuário e que as partes que funcionassem seriam executadas. Assim se um usuário enviar um **JSON** com parcialmente correto, ele receberá uma mensagem dizendo que foi exucutado a sua requisição, porém erros ocorreram e será apontado o possível erro ao usuário para que ele possa consertar e fazer uma nova requisição somente com aquilo que deu errado sabendo que o resto executou normalmente.
