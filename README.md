# REST API

Backend for React class project meeting the following requirements:

- Crie um novo projeto em react no github chamado my-alpha-backend.
- Crie um modulo chamado proﬁler no seu backend
- O modulo deve ser capaz de contactar o modulo de database, realizar as seguintes operações:
    - Inserir um usuário = user.insert (nome, senha, foto, data de nascimento, email)
    - Deletar um usuário = user.delete
    - Editar um usuário = user.edit
    - Validar um usuário = user.validate
    - Visualizar um usuário = user.view (por id, nome, email)
- Os seguintes campos devem ser validados pelo backend no ato de INSERIR UM USUARIO (user.insert):
    - senha (8 caracteres contendo 1 numero)
    - email ( * @ domain .com )
    - data de nascimento ( AAAA/MM/DD )
- O controle de sessão deve ser realizado com JWT
    - uuid = id único gerado aleatoriamente para o usuário inserido pelo método user.insert

Obs:
É estrito realizar o projeto atendendo a todos os requisitos informados na descrição da atividade, incluindo os métodos do CRUD de usuários e os nomes da sua classe pai (user)