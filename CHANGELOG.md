# O que mudou nesta versão

Comparação com o estado anterior do repositório. Tudo testado: `npm run validate`,
`npm run lint` e `npm run build` (frontend) e sintaxe + arranque real do Express
(backend) passam sem erros.

## 🔴 Críticos (estavam a fazer perder pontos / a faltar)

1. **Estrutura de pastas do frontend não passava a validação automática**
   (`npm run validate` falhava → lint e build nem chegavam a correr no CI).
   - `src/app/pages/` → renomeado para `src/app/features/`
   - `src/app/services/` → renomeado para `src/app/core/services/`
   - Criadas `src/app/core/models/` e `src/app/core/guards/` (novas)

2. **`backend/server.js` tinha um bug de merge mal resolvido**: a função
   `authenticateToken` e várias rotas estavam duplicadas (copiadas e coladas
   duas vezes seguidas no mesmo ficheiro). Corrigido e reorganizado em:
   `app.js`, `server.js`, `routes/`, `controllers/`, `models/`, `middleware/`.

3. **`recipe-detail.component` estava vazio** (só tinha um `<h1>`). Implementada
   a página completa: imagem, categoria/origem, lista de ingredientes com
   medidas, instruções, link para vídeo do YouTube e botão de favoritar.

4. **Bug em `favorites.component`**: usava `http://localhost:3000/favorites`
   fixo no código (funcionava por acaso em dev, partia em produção). Resolvido
   com um `FavoriteService` novo + um interceptor HTTP que adiciona o token
   automaticamente a todos os pedidos `/api/...`.

5. **`register.component.css` estava vazio (0 bytes)** — a página de registo
   aparecia sem nenhum estilo (texto cru, sem cartão, sem espaçamento),
   enquanto o login (com o mesmo layout) aparecia bem. Resolvido copiando o
   CSS do login, já que ambas as páginas usam exatamente as mesmas classes
   (`.auth-page`, `.auth-card`, `.form-group`, etc.).

## 🟢 Redesign visual (paleta verde, estilo Receiteria)

- Paleta trocada de laranja para **verde floresta/oliva** (`--primary: #3a5a40`)
  com um dourado/mostarda (`--accent`) para pequenos destaques (botão de
  pesquisa, tags de origem).
- Tipografia dos títulos trocada de `Playfair Display` (serifada) para
  `Quicksand` (arredondada, mais "food blog").
- **Categorias** na página de receitas passaram de botões simples a chips
  circulares com ícone (estilo Receiteria), num novo ficheiro
  `src/app/shared/category-icons.ts` que mapeia cada categoria real da
  TheMealDB a um emoji (não é dado inventado, só apresentação).
- **Cards de receita** ganharam um badge com a categoria sobre a imagem.
- Detalhe da receita: tags com ícone, cores atualizadas.

## 🟠 Adicionado

- `src/app/core/models/` — interfaces TypeScript (`Recipe`, `Category`,
  `Ingredient`, `User`, `Favorite`, `AuthResponse`) em vez de `any` em todo o lado.
- `src/app/core/services/favorite.service.ts` — novo serviço dedicado aos favoritos.
- `src/app/core/interceptors/auth.interceptor.ts` — anexa o JWT automaticamente.
- `src/app/core/guards/auth.guard.ts` — protege a rota `/favorites`.
- Backend: `routes/`, `controllers/`, `models/`, `middleware/auth.middleware.js`
  (antes era tudo um único `server.js`).

## 🟡 Corrigido (qualidade / lint)

61 erros de lint resolvidos em todos os componentes:
- `any` → tipos reais (`Recipe`, `User`, etc.)
- Injeção pelo construtor → `inject()` (estilo Angular atual)
- `*ngIf` / `*ngFor` → novo control flow `@if` / `@for`
- Acessibilidade: labels associadas aos inputs (`for`/`id`), cartão de receita
  passou de `<div (click)>` para `<a [routerLink]>`

## Não mudou

- Lógica de autenticação (bcrypt + JWT), schema da base de dados, design/CSS,
  fluxo de pesquisa e categorias — só foi reorganizado/tipado, não reescrito
  de raiz.
- Backend continua dentro da pasta `backend/` deste mesmo repositório (sem
  fork do template do professor, conforme combinado).

## Por fazer (sugestões, não bloqueantes)

- `npm install` no `backend/` para instalar dependências (se ainda não tiverem)
  e copiar `backend/.env.example` para `backend/.env` com um `JWT_SECRET` próprio.
- Testes unitários mais completos (os specs existentes foram só corrigidos
  para não rebentar, não foram expandidos).
