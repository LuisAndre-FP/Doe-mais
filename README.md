# Doe+ — Plataforma de Gerenciamento de Doações

Aplicação web desenvolvida como Trabalho de Conclusão de Curso (TCC) para facilitar o processo de doação de itens, conectando doadores a uma equipe de coleta. O sistema permite que usuários registrem itens para doação, acompanhem o status de cada solicitação e visualizem seu histórico de contribuições.

---

## Funcionalidades

### Doador
- Cadastro e login com e-mail/senha ou conta Google
- Registro de itens para doação com foto, descrição, quantidade e estado do item
- Acompanhamento em tempo real do status de cada doação (Pendente → Agendada → Coletada)
- Visualização do agendamento de coleta (data e período)
- Histórico completo de doações finalizadas
- Gerenciamento de perfil pessoal

### Administrador
- Painel exclusivo de gerenciamento de todas as doações
- Agendamento e reagendamento de coletas com data, período e observações
- Marcação de doações como coletadas
- Controle de permissões de usuários (promover/rebaixar para ADMIN)
- Registro de auditoria de ações administrativas
- Filtro de doações por status

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | [React 19](https://react.dev/) + [Vite 7](https://vite.dev/) |
| Estilização | [Tailwind CSS](https://tailwindcss.com/) |
| Backend / Banco de dados | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage) |
| Roteamento | [React Router DOM v7](https://reactrouter.com/) |
| Ícones | [Lucide React](https://lucide.dev/) |

---

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── AdminRoute.jsx   # Guard de rota para admins
│   ├── ProtectedRoute.jsx
│   ├── SideMenu.jsx
│   ├── Modal.jsx
│   └── PageHeader.jsx
├── constants/
│   └── donations.js     # Constantes de STATUS, PERIODO e ROLE
├── features/
│   ├── admin/           # Painel administrativo
│   ├── auth/            # Login, cadastro, recuperação de senha
│   ├── donations/       # Fluxo de doações do usuário
│   └── profile/         # Perfil do usuário
├── hooks/
│   ├── useSession.js    # Gerenciamento de sessão Supabase
│   └── useRole.js       # Controle de permissão por role
├── layouts/
│   └── AppLayout.jsx    # Layout autenticado com sidebar
└── lib/
    └── supabaseClient.js
```

---

## Rotas

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Público | Tela de login |
| `/cadastro` | Público | Tela de cadastro |
| `/esqueci-senha` | Público | Recuperação de senha |
| `/atualizar-senha` | Público | Redefinição de senha |
| `/doacoes` | Autenticado | Fazer nova doação |
| `/minhas-doacoes` | Autenticado | Acompanhar minhas doações |
| `/historico` | Autenticado | Histórico de doações coletadas |
| `/perfil` | Autenticado | Perfil do usuário |
| `/admin` | Admin | Gerenciamento de doações |

---

## Como Executar Localmente

### Pré-requisitos
- Node.js 18+
- Uma conta no [Supabase](https://supabase.com/) com projeto criado

### 1. Clone o repositório

```bash
git clone https://github.com/LuisAndre-FP/Doe-mais.git
cd Doe-mais
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

As credenciais estão disponíveis em **Settings → API** no painel do Supabase.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`.

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Visualiza o build de produção localmente |
| `npm run lint` | Executa o ESLint |

---

## Configuração do Supabase

O projeto utiliza os seguintes recursos do Supabase:

- **Authentication** — login com e-mail/senha e OAuth com Google
- **Database (PostgreSQL)** — tabelas `donations` e `profiles` com Row Level Security (RLS) configurado
- **Storage** — bucket `donation-photos` para armazenamento das fotos dos itens

> As políticas de RLS garantem que cada usuário acessa apenas seus próprios dados, enquanto administradores têm acesso completo.
