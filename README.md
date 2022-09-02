# Desafio Codex Backend
Api desenvolvida em NodeJS, para o desafio do processo seletivo da Empresa Júnior de Computação da UFCG - Codex.

### Descrição:
Sistema para gerenciar tarefas. Podendo adicionar, remover, editar e listar tarefas por ordem de prioridade.

### Endpoints:
##### Criar Usuário: 
  * POST /users
  * Body:
    ```
    {
      "name": "User Name",
      "email": "email@codexjr.com.br",
      "password": "12345678"
    }
    ```
    
##### Login: 
  * POST /users/login
  * Body:
    ```
    {
      "email": "email@codexjr.com.br",
      "password": "12345678"
    }
    ```
    
##### Logout: 
  * GET /users/logout

##### Criar Tarefa: 
  * POST /tasks
  * Body:
    ```
    {
      "name": "Task Name",
      "priority": "alta"
    }
    ```
    
##### Listar Tarefas: 
  * GET /tasks

##### Editar Tarefa: 
  * PUT /task/:idTask
  * Body:
    ```
    {
      "name": "Task Name",
      "priority": "alta"
    }
    ```
    ou
    ```
    {
      "priority": "alta"
    }
    ```
    ou
    ```
    {
      "name": "Task Name"
    }
    ```
    
##### Deletar Tarefa: 
  * DELETE /task/:idTask
