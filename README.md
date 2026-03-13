# Doe+ — Sistema Web de Gestão de Doações para ONGs

O **Doe+** é um sistema web desenvolvido como Trabalho de Conclusão de Curso (TCC) com o objetivo de facilitar o gerenciamento de doações destinadas a organizações não governamentais (ONGs).

A plataforma permite que usuários cadastrem doações, acompanhem o status das entregas e que administradores organizem o processo de coleta e distribuição dos itens doados.

---

## 📌 Objetivo do Projeto

O objetivo do sistema é oferecer uma solução simples e acessível para:

- registrar doações
- acompanhar o status das doações
- organizar coletas
- facilitar a comunicação entre doadores e administradores

O projeto foi desenvolvido com foco em **simplicidade, organização de dados e facilidade de uso**.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- React
- Vite
- TailwindCSS
- React Router

### Backend / Serviços
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage

### Deploy
- Vercel

---

## 🏗 Arquitetura do Sistema

O sistema segue uma arquitetura simples baseada em:
Frontend (React)
↓
Supabase Auth (autenticação)
↓
Supabase Database (PostgreSQL)
↓
Supabase Storage (imagens das doações)


---

## 🔐 Autenticação

O sistema utiliza **Supabase Auth** com:

- Login com Google
- Login com Email e Senha
- Confirmação de email

Cada usuário possui um perfil com:

- nome
- telefone
- endereço

---

## 👤 Tipos de Usuário

O sistema possui dois tipos de usuários:

### Usuário (USER)
Pode:

- cadastrar doações
- visualizar histórico de doações
- acompanhar status da coleta

### Administrador (ADMIN)
Pode:

- visualizar todas as doações
- filtrar doações pendentes
- agendar coleta
- marcar doações como coletadas

---

## 📦 Funcionalidades

### Cadastro de Doações
O usuário pode registrar uma doação informando:

- foto do item
- descrição
- quantidade
- nível de uso

---

### Histórico de Doações

Cada doação possui um status:

- **PENDENTE** → aguardando análise
- **AGENDADA** → coleta agendada
- **COLETADA** → item coletado

---

### Painel Administrativo

Administradores podem:

- visualizar todas as doações
- filtrar doações pendentes
- agendar coletas
- atualizar status das doações

---

## 📱 Responsividade

O sistema foi desenvolvido para funcionar em diferentes dispositivos:

- Desktop
- Tablet
- Smartphones

Utilizando **TailwindCSS** com abordagem **mobile-first**.

---

## ☁ Deploy

A aplicação está hospedada na **Vercel**.

Link do projeto: doe-mais-lovat.vercel.app


---

## 📂 Estrutura do Projeto
src
│
├── components
│ ├── Header
│ ├── SideMenu
│ └── Modal
│
├── layouts
│ └── AppLayout
│
├── features
│ ├── auth
│ ├── donations
│ ├── admin
│ └── profile
│
├── hooks
├── services
└── App.jsx



