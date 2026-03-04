# 🗂️ Projeto: Portal de Gestão de Pagamentos

## ⚙️ Stack & Arquitetura

- **Frontend:** React + Vite + JavaScript
- **Deploy:** GitHub Pages (repositório **privado** com Pages habilitado)
- **Dados:** Planilha Excel (.xlsx) armazenada no próprio repositório
- **Autenticação:** Senhas hardcoded no frontend (sem backend)
- **Bibliotecas principais:** `xlsx` (SheetJS), `react-router-dom`, `gh-pages`

---

## 🔐 Lógica de Senhas

| Senha | Acesso |
|---|---|
| Senha Normal | Visualização dos dados |
| Senha Admin | Visualização + upload de nova planilha |

> ⚠️ **Importante:** Como é GitHub Pages (sem backend), a senha ficará no código. O repositório **privado** protege isso — ninguém vê o código fonte, só o site publicado.

---

## 📋 Fases de Desenvolvimento

---

### ✅ Fase 1 — Setup do Projeto
**Objetivo:** Ambiente funcionando e deploy configurado.

1. Criar projeto com `npm create vite@latest`
2. Instalar dependências: `react-router-dom`, `xlsx`, `gh-pages`
3. Configurar `vite.config.js` para GitHub Pages (`base: '/nome-do-repo/'`)
4. Configurar `package.json` com scripts de deploy (`predeploy`, `deploy`)
5. Criar repositório **privado** no GitHub e conectar
6. Testar deploy inicial com página em branco

**Entregável:** Site no ar em `https://seuuser.github.io/nome-do-repo/`

---

### ✅ Fase 2 — Tela de Login
**Objetivo:** Tela de senha funcional com dois níveis de acesso.

1. Criar componente `Login.jsx`
2. Implementar lógica:
   - Senha correta normal → redireciona para `/dashboard` com estado `viewer`
   - Senha admin → redireciona com estado `admin`
   - Senha errada → exibe mensagem *"Não foi possível acessar, verifique com o administrador"*
3. Proteger rotas (usuário sem login não acessa `/dashboard`)
4. Estilizar a tela de login

**Entregável:** Login funcionando com redirecionamento correto.

---

### ✅ Fase 3 — Leitura e Exibição da Planilha
**Objetivo:** Carregar o Excel do repositório e exibir os dados formatados.

1. Criar planilha `.xlsx` modelo com as colunas:
   - `Nome`
   - `Pagamento Água` (Sim/Não)
   - `Pagamento Luz` (Sim/Não)
   - `Link Comprovante Água` (caminho do PDF)
   - `Link Comprovante Luz` (caminho do PDF)
2. Colocar a planilha em `/public/data/dados.xlsx`
3. Criar função utilitária para ler e parsear o `.xlsx` com SheetJS
4. Criar componente `Dashboard.jsx` que exibe os dados em cards/tabela
5. Botões de download de PDF linkando para `/public/comprovantes/arquivo.pdf`

#### 🔓 Modo Admin — Edição inline no Dashboard
Quando logado como **admin**, o dashboard habilita edição direta em cada linha:

- **Campos Sim/Não** (`Pagamento Água`, `Pagamento Luz`): viram um toggle/select editável
- **Campos de comprovante** (`Link Comprovante Água`, `Link Comprovante Luz`): exibem botão para **upload de PDF**, substituindo ou adicionando o arquivo
- Após editar, botão **"Salvar alterações"** atualiza o estado local e gera novo `.xlsx` para commit (seguindo estratégia da Fase 4)

> Usuário **viewer** vê apenas os dados estáticos, sem nenhum controle de edição visível.

**Entregável:** Dados da planilha visíveis no site, com edição inline funcional para admin.

---

### ✅ Fase 4 — Upload de Nova Planilha (Admin)
**Objetivo:** Admin consegue subir nova planilha pelo site.

1. Exibir botão de upload **apenas** para usuário com perfil `admin`
2. Componente `UploadPlanilha.jsx` com input de arquivo `.xlsx`
3. Ao selecionar, parsear e pré-visualizar os dados antes de confirmar
4. **Estratégia de "salvar":**
   - O site não pode escrever no repositório diretamente
   - **Opção A** *(mais simples):* Gerar download do arquivo processado → admin faz commit manual
   - **Opção B** *(automatizada):* Usar **GitHub API** com token para fazer commit programático do arquivo
   - > Recomendo começar com **Opção A** e evoluir para B depois

**Entregável:** Admin consegue carregar nova planilha e atualizar os dados.

---

### ✅ Fase 5 — PDFs e Comprovantes
**Objetivo:** Comprovantes acessíveis para download.

1. Definir estrutura de pastas: `/public/comprovantes/agua/`, `/public/comprovantes/luz/`
2. Mapear nomes na planilha com os arquivos PDF correspondentes
3. Botão de download no dashboard linka corretamente para cada PDF
4. Tratar caso onde PDF não existe (botão desabilitado ou mensagem)

**Entregável:** Download de comprovantes funcionando.

---

### ✅ Fase 6 — Polimento e Segurança Final
**Objetivo:** Deixar pronto para uso real.

1. Revisar que nenhuma senha aparece exposta em logs ou console
2. Confirmar que repositório está **privado** no GitHub
3. Adicionar `.gitignore` adequado
4. Responsividade mobile
5. Testes finais de fluxo completo (login → visualização → download → upload admin)

**Entregável:** Site pronto para uso.

---

## 🗓️ Ordem Sugerida de Implementação

```
Fase 1 → Fase 2 → Fase 3 → Fase 5 → Fase 4 → Fase 6
```
