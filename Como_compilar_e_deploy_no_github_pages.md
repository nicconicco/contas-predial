# Como Compilar e Deploy no GitHub Pages

## Pré-requisitos

- Node.js instalado
- GitHub CLI instalado (`brew install gh`)
- Autenticado no GitHub (`gh auth login`)

## Comandos

### Rodar localmente (desenvolvimento)

```bash
npm run dev
```

Acesse `http://localhost:5173/`

### Build de produção

```bash
npm run build
```

Gera a pasta `dist/` com os arquivos compilados.

### Deploy no GitHub Pages

```bash
npm run deploy
```

Este comando faz duas coisas automaticamente:
1. `npm run build` — compila o projeto
2. `gh-pages -d dist` — publica a pasta `dist/` no branch `gh-pages`

### Se der erro de cache do gh-pages

```bash
npx gh-pages-clean
npm run deploy
```

## Configuração no GitHub

1. Vá em **Settings > Pages** no repositório
2. Em **Source**, selecione o branch **`gh-pages`**
3. Pasta: **`/ (root)`**
4. Salve e aguarde 1-2 minutos

O site estará disponível em: `https://nicconicco.github.io/contas-predial/`
