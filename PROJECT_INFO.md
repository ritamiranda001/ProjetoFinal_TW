# Project Information

## Group Members

- Keila dos Santos (34668)
- Rita Miranda (34581)

## Project Theme

Recipe Tracker — descoberta e gestão pessoal de receitas culinárias.

## External API Used

- API name: TheMealDB
- API link: https://www.themealdb.com/api.php
- Requires API key? No (chave de teste pública "1")

## Backend Repository

- Link: https://github.com/ritamiranda001/ProjetoFinal_TW (pasta `backend/` deste mesmo repositório)

## Main Features

1. Pesquisar receitas por nome e por categoria (API externa TheMealDB)
2. Ver o detalhe de uma receita (ingredientes, medidas e modo de preparação)
3. Registo e login de utilizadores (JWT)
4. Guardar e remover receitas dos favoritos (persistido no nosso backend)

## Pages

- Home / Receitas (`/recipes`): pesquisa, filtro por categoria, grelha de resultados
- Detalhe (`/recipes/:id`): ingredientes, instruções, botão de favoritar
- Favoritos (`/favorites`): lista de receitas guardadas pelo utilizador autenticado
- Login (`/login`) e Registo (`/register`)

## Data Stored in the Backend

- users (nome, email, password com hash)
- favorites (utilizador, id/nome/imagem da receita)

## Notes

Arquitetura: o frontend consome a API externa (TheMealDB) diretamente para
pesquisa/listagem/detalhe de receitas, e consome o nosso backend (Node/Express,
pasta `backend/`) para autenticação e para guardar os favoritos de cada utilizador.
Backend e frontend ficam no mesmo repositório (acordado com o professor).
