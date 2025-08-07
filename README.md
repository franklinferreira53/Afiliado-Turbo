# Afiliado Turbo - Sistema SaaS Automatizado

![Afiliado Turbo](https://via.placeholder.com/800x400/3B82F6/ffffff?text=Afiliado+Turbo)

## 🚀 Visão Geral

O Afiliado Turbo é um sistema SaaS 100% automatizado para marketing de afiliados, utilizando inteligência artificial para gerar conteúdo, identificar produtos virais e automatizar publicações em redes sociais.

### ✨ Funcionalidades Principais

- 🛍️ **Seleção Automática de Produtos**: Integração com APIs da Amazon e Shopee
- 🧠 **Geração de Conteúdo com IA**: Textos, imagens futuristas, vídeos e legendas
- 📱 **Automação de Publicação**: Instagram, Facebook, TikTok e WhatsApp
- 📊 **Analytics Avançado**: Dashboard com métricas de performance em tempo real
- 🎨 **Interface Moderna**: Design responsivo e tecnológico

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** com Express.js
- **PostgreSQL** como banco de dados principal
- **Redis** para cache e sessões
- **Bull** para processamento de filas
- **JWT** para autenticação
- **Winston** para logging

### Frontend
- **React** com TypeScript
- **Tailwind CSS** para styling
- **React Router** para navegação
- **React Hook Form** para formulários
- **Chart.js** para gráficos
- **Framer Motion** para animações

### Integrações de IA
- **OpenAI GPT** para geração de textos
- **Stable Diffusion** para criação de imagens
- **Text-to-Speech** para narração de vídeos

### APIs de E-commerce
- **Amazon Product Advertising API**
- **Shopee Affiliate API**

### Redes Sociais
- **Facebook Graph API** (Instagram/Facebook)
- **TikTok API** (em desenvolvimento)
- **WhatsApp Business API** (em desenvolvimento)

## 📁 Estrutura do Projeto

```
afiliado-turbo/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── services/        # Lógica de negócio
│   │   ├── models/          # Modelos do banco de dados
│   │   ├── routes/          # Definição de rotas
│   │   ├── middleware/      # Middlewares
│   │   └── utils/           # Utilitários
│   └── tests/              # Testes automatizados
├── frontend/               # Interface React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── context/        # Context API
│   │   └── utils/          # Utilitários
├── database/               # Scripts de banco
├── ai-services/            # Serviços de IA
├── docs/                   # Documentação
└── scripts/                # Scripts de deploy
```

## 🚀 Instalação e Setup

### Pré-requisitos
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (opcional)

### 1. Clonagem do Repositório
```bash
git clone https://github.com/franklinferreira53/Afiliado-Turbo.git
cd Afiliado-Turbo
```

### 2. Configuração do Ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Instalação das Dependências

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 4. Configuração do Banco de Dados
```bash
# Criar o banco PostgreSQL
createdb afiliado_turbo

# Executar as migrações
psql afiliado_turbo -f database/schema.sql
```

### 5. Execução com Docker (Recomendado)
```bash
docker-compose up -d
```

### 6. Execução Manual

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm start
```

## 🔧 Configuração de APIs

### Amazon Product Advertising API
1. Registre-se no [Amazon Associates](https://affiliate-program.amazon.com/)
2. Obtenha suas credenciais da API
3. Configure no arquivo `.env`:
```env
AMAZON_ACCESS_KEY=sua-chave-de-acesso
AMAZON_SECRET_KEY=sua-chave-secreta
AMAZON_ASSOCIATE_TAG=sua-tag-de-afiliado
```

### Shopee Affiliate API
1. Registre-se no [Shopee Affiliate](https://affiliate.shopee.com.br/)
2. Configure no arquivo `.env`:
```env
SHOPEE_PARTNER_ID=seu-partner-id
SHOPEE_PARTNER_KEY=sua-partner-key
```

### OpenAI API
1. Obtenha sua chave em [OpenAI](https://platform.openai.com/)
2. Configure no arquivo `.env`:
```env
OPENAI_API_KEY=sua-chave-openai
```

### Facebook/Instagram API
1. Crie um app no [Facebook Developers](https://developers.facebook.com/)
2. Configure no arquivo `.env`:
```env
FACEBOOK_APP_ID=seu-app-id
FACEBOOK_APP_SECRET=seu-app-secret
```

## 📊 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Registro de usuários
- [x] Login/Logout
- [x] Autenticação JWT
- [x] Proteção de rotas

### ✅ Dashboard
- [x] Visão geral de métricas
- [x] Produtos com melhor performance
- [x] Atividade recente
- [x] Ações rápidas

### ✅ Produtos
- [x] Busca de produtos
- [x] Produtos em alta
- [x] Filtros por fonte e categoria
- [x] Salvamento de produtos
- [x] Geração de links de afiliado

### ✅ Geração de Conteúdo
- [x] Posts para redes sociais
- [x] Imagens com IA
- [x] Scripts de vídeo
- [x] Descrições otimizadas
- [x] Hashtags automáticas
- [x] CTAs personalizados

### ✅ Analytics
- [x] Métricas de performance
- [x] Gráficos temporais
- [x] Performance por plataforma
- [x] Top produtos
- [x] Exportação de relatórios

### ✅ Configurações
- [x] Perfil do usuário
- [x] Preferências de conteúdo
- [x] Notificações
- [x] Configurações de segurança

## 🔄 Fluxo de Trabalho

1. **Busca de Produtos**: O usuário busca produtos ou visualiza produtos em alta
2. **Geração de Conteúdo**: IA gera posts, imagens e textos automaticamente
3. **Revisão**: Usuário revisa e aprova o conteúdo gerado
4. **Publicação**: Sistema publica automaticamente nas redes sociais
5. **Analytics**: Acompanhamento de métricas e performance

## 🚦 Status do Projeto

- ✅ **Backend API**: 100% funcional
- ✅ **Frontend**: 100% implementado
- ✅ **Autenticação**: Completo
- ✅ **Dashboard**: Funcional com dados mock
- ✅ **Produtos**: Busca e listagem implementadas
- ✅ **Geração de Conteúdo**: Interface completa
- ✅ **Analytics**: Dashboard com visualizações
- ✅ **Configurações**: Painel completo
- 🔄 **Integrações de API**: Estrutura pronta, aguardando keys
- 🔄 **Deploy**: Docker configurado

## 📈 Próximos Passos

1. **Integração Real das APIs**: Configurar chaves reais das APIs
2. **Testes**: Implementar testes automatizados
3. **Deploy**: Configurar pipeline de CI/CD
4. **Monitoring**: Adicionar monitoramento em produção
5. **Otimizações**: Performance e SEO

## 🤝 Contribuição

Este é um projeto privado. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença proprietária. Todos os direitos reservados.

## 📞 Suporte

Para suporte técnico, entre em contato:
- Email: suporte@afiliadoturbo.com
- Discord: [Link do servidor]
- Documentação: [docs.afiliadoturbo.com]

---

**Afiliado Turbo** - Transformando o marketing de afiliados com IA 🚀
