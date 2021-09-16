# SignIn

> ## Caso de sucesso

1. &#9989; Recebe uma requisição do tipo **POST** na rota **/api/login**
2. &#9989; Valida dados obrigatórios **email** e **password**
3. &#9989; Valida que o campo **email** é um e-mail válido
4. &#9989; **Busca** o usuário com o email e senha fornecidos
5. &#9989; Gera um **token** de acesso a partir do ID do usuário
6. &#9989; **Atualiza** os dados do usuário com o token de acesso gerado
7. &#9989; Retorna **200** com o token de acesso e o nome do usuário

> ## Exceções

1. &#9989; Retorna erro **404** se a API não existir
2. &#9989; Retorna erro **400** se email ou password não forem fornecidos pelo client
3. &#9989; Retorna erro **400** se o campo email for um e-mail inválido
4. &#9989; Retorna erro **401** se não encontrar um usuário com os dados fornecidos
5. &#9989; Retorna erro **500** se der erro ao tentar gerar o token de acesso
6. &#9989; Retorna erro **500** se der erro ao tentar atualizar o usuário com o token de acesso gerado
