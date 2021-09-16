# SignUp

> ## Caso de sucesso

1. &#9989; Recebe uma requisição do tipo **POST** na rota **/api/signup**
2. &#9989; Valida dados obrigatórios **name**, **email**, **password** e **passwordConfirmation**
3. &#9989; Valida que **password** e **passwordConfirmation** são iguais
4. &#9989; Valida que o campo **email** é um e-mail válido
5. &#9989; **Valida** se já existe um usuário com o email fornecido
6. &#9989; Gera uma senha **criptografada** (essa senha não pode ser descriptografada)
7. &#9989; **Cria** uma conta para o usuário com os dados informados, **substituindo** a senha pela senha criptorafada
8. &#9989; Gera um **token** de acesso a partir do ID do usuário
9. &#9989; **Atualiza** os dados do usuário com o token de acesso gerado
10. &#9989; Retorna **200** com o token de acesso e o nome do usuário

> ## Exceções

1. &#9989; Retorna erro **404** se a API não existir
2. &#9989; Retorna erro **400** se name, email, password ou passwordConfirmation não forem fornecidos pelo client
3. &#9989; Retorna erro **400** se password e passwordConfirmation não forem iguais
4. &#9989; Retorna erro **400** se o campo email for um e-mail inválido
5. &#9989; Retorna erro **403** se o email fornecido já estiver em uso
6. &#9989; Retorna erro **500** se der erro ao tentar gerar uma senha criptografada
7. &#9989; Retorna erro **500** se der erro ao tentar criar a conta do usuário
8. &#9989; Retorna erro **500** se der erro ao tentar gerar o token de acesso
9. &#9989; Retorna erro **500** se der erro ao tentar atualizar o usuário com o token de acesso gerado
