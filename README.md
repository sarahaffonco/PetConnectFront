# 🐾 PetConnect - Frontend

<div align="center">
  
  ![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![Axios](https://img.shields.io/badge/Axios-1.12.2-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
  
  **Plataforma web moderna para adoção de pets, conectando animais que precisam de um lar com pessoas dispostas a adotar.**

  [Demo](#-demonstração) • [Funcionalidades](#-funcionalidades) • [Instalação](#-instalação) • [Documentação](#-documentação-da-api)

</div>

---

## 📋 Sobre o Projeto

PetConnect é uma aplicação web completa desenvolvida com React e Vite, focada em facilitar o processo de adoção de animais de estimação. A plataforma oferece uma interface intuitiva e responsiva, permitindo que usuários naveguem por pets disponíveis, favoritem seus preferidos e realizem adoções de forma simples e segura.

### 🎯 Objetivo

Criar uma ponte entre animais que precisam de um lar e pessoas dispostas a adotar, tornando o processo de adoção mais acessível, transparente e eficiente.

---

## ✨ Funcionalidades

### 🔐 Autenticação e Gerenciamento de Usuários
- ✅ Cadastro de novos adotantes
- ✅ Login seguro com JWT
- ✅ Perfil do usuário editável
- ✅ Exclusão de conta
- ✅ Histórico de adoções

### 🐶 Gerenciamento de Pets
- ✅ Listagem de cães e gatos disponíveis
- ✅ Filtros avançados (espécie, tamanho, personalidade, idade)
- ✅ Paginação inteligente
- ✅ Cadastro de novos pets (CRUD completo)
- ✅ Edição inline de informações dos pets
- ✅ Sistema de status (disponível/adotado)

### ❤️ Sistema de Favoritos
- ✅ Adicionar pets aos favoritos
- ✅ Remover favoritos
- ✅ Visualização rápida de pets favoritados
- ✅ Ícones visuais indicando status

### 🏠 Processo de Adoção
- ✅ Solicitação de adoção com observações
- ✅ Confirmação de dados do adotante
- ✅ Atualização automática de status
- ✅ Rastreamento de adoções no perfil
- ✅ Cancelamento de adoções

### 📱 Interface Responsiva
- ✅ Design mobile-first
- ✅ Adaptação para tablets e desktops
- ✅ Navegação intuitiva
- ✅ Animações suaves

---

## 🛠️ Tecnologias Utilizadas

### Core
- **React 19.1.1** - Biblioteca JavaScript para construção de interfaces
- **Vite 7.1.7** - Build tool moderna e rápida
- **React Router DOM 7.9.4** - Gerenciamento de rotas

### Estilização
- **CSS3 Moderno** - Estilização com variáveis CSS
- **Styled Components 6.1.19** - CSS-in-JS
- **FontAwesome 7.1.0** - Biblioteca de ícones

### Comunicação
- **Axios 1.12.2** - Cliente HTTP para consumo de API
- **JWT** - Autenticação baseada em tokens

### Desenvolvimento
- **ESLint** - Linter para qualidade de código
- **Vite Plugin React** - HMR e Fast Refresh

---

## 🚀 Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Backend do PetConnect rodando (veja [documentação do backend](#-documentação-da-api))

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/PetConnectFront.git
cd PetConnectFront
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

5. **Acesse a aplicação**

Abra seu navegador em `http://localhost:5173`

---

## 📁 Estrutura do Projeto

```
PetConnectFront/
├── public/                  # Arquivos estáticos
├── src/
│   ├── assets/             # Imagens e recursos
│   ├── components/         # Componentes reutilizáveis
│   │   ├── footer.jsx
│   │   └── navBar.jsx
│   ├── config/             # Configurações e constantes
│   │   └── constants.js
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.js      # Hook de autenticação
│   │   └── useFavoritos.js # Hook de favoritos
│   ├── models/             # Modais da aplicação
│   │   ├── modalAdocao.jsx
│   │   ├── modalCadastroPet.jsx
│   │   ├── modalCadastroUsuario.jsx
│   │   ├── modalDeleteUsuario.jsx
│   │   └── modalLogin.jsx
│   ├── pages/              # Páginas da aplicação
│   │   ├── adocaoCaes.jsx
│   │   ├── adocaoGatos.jsx
│   │   ├── contato.jsx
│   │   ├── home.jsx
│   │   └── usuario.jsx
│   ├── router/             # Configuração de rotas
│   │   └── router.jsx
│   ├── styles/             # Arquivos CSS
│   │   ├── App.css
│   │   ├── index.css
│   │   └── ...
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Ponto de entrada
├── .env                    # Variáveis de ambiente
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔗 Documentação da API

### Endpoints Principais

#### Autenticação
- `POST /api/adotantes` - Cadastro de novo adotante
- `POST /api/adotantes/login` - Login de adotante
- `GET /api/adotantes/:id` - Buscar adotante por ID
- `PUT /api/adotantes/:id` - Atualizar dados do adotante
- `DELETE /api/adotantes/:id` - Deletar conta de adotante

#### Pets
- `GET /api/pets` - Listar pets com filtros e paginação
- `GET /api/pets/:id` - Buscar pet por ID
- `POST /api/pets` - Cadastrar novo pet
- `PUT /api/pets/:id` - Atualizar informações do pet
- `DELETE /api/pets/:id` - Deletar pet

#### Adoções
- `GET /api/adocoes` - Listar todas as adoções
- `GET /api/adocoes/:id` - Buscar adoção por ID
- `POST /api/adocoes` - Criar nova adoção
- `PUT /api/adocoes/:id` - Atualizar observações da adoção
- `DELETE /api/adocoes/:id` - Cancelar adoção

#### Favoritos
- `GET /api/favoritos/usuario/:usuarioId` - Listar favoritos do usuário
- `POST /api/favoritos` - Adicionar pet aos favoritos
- `DELETE /api/favoritos/:usuarioId/:petId` - Remover favorito

---

## 🎯 Funcionalidades em Destaque

### Sistema de Filtros Avançados
Os usuários podem filtrar pets por múltiplos critérios:
- **Espécie**: Cães ou Gatos
- **Tamanho**: Pequeno, Médio ou Grande
- **Personalidade**: Brincalhão ou Calmo
- **Idade**: Faixa etária mínima e máxima

### Edição Inline
Interface de edição direta nos cards dos pets, permitindo atualização rápida de informações sem necessidade de modais adicionais.

### Autenticação Persistente
Sistema de autenticação com JWT armazenado localmente, mantendo o usuário logado entre sessões.

### Paginação Inteligente
Sistema de paginação com informações detalhadas sobre o número de resultados e páginas disponíveis.

---

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção

# Preview
npm run preview      # Preview do build de produção

# Linting
npm run lint         # Executa ESLint
```

---

## 📦 Build de Produção

Para gerar uma build de produção:

```bash
npm run build
```

Os arquivos otimizados estarão disponíveis na pasta `dist/`.

Para testar a build localmente:

```bash
npm run preview
```

---

## 🌐 Deploy

A aplicação pode ser facilmente deployada em plataformas como:

- **Vercel** (Recomendado para projetos Vite)
- **Netlify**
- **GitHub Pages**
- **Railway**

### Deploy na Vercel

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autor

**Sarah**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu Nome](https://linkedin.com/in/seu-perfil)
- Email: seu.email@exemplo.com

---

## 🙏 Agradecimentos

- Ícones por [FontAwesome](https://fontawesome.com)
- Design inspirado em plataformas modernas de adoção
- Comunidade React pela documentação excelente

---

## 📊 Status do Projeto

🟢 **Em Desenvolvimento Ativo**

### Roadmap

- [ ] Sistema de chat entre adotantes e responsáveis
- [ ] Notificações em tempo real
- [ ] Upload de fotos dos pets
- [ ] Sistema de avaliações e comentários
- [ ] Integração com mapas para localização
- [ ] PWA (Progressive Web App)
- [ ] Dark mode

---

<div align="center">

### ⭐ Se este projeto foi útil para você, considere dar uma estrela!

**Feito com ❤️ e React**

</div>
