# 🛠️ Guia de Configuração — Wedding Site (Payload CMS + MongoDB)

Este documento explica como configurar o ambiente de desenvolvimento e produção do site de casamento.

---

## 📋 Pré-requisitos

- **Node.js** >= 18.18 (recomendado: 20.x)
- **pnpm** >= 9.x (`npm install -g pnpm`)
- **MongoDB** 6+ (local ou Atlas)

---

## 1️⃣ MongoDB — Banco de Dados

### Opção A: MongoDB Local (desenvolvimento)

1. **Instalar MongoDB Community Server:**
   - Windows: [Download MongoDB](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: [Instruções oficiais](https://www.mongodb.com/docs/manual/installation/)

2. **Iniciar o serviço:**
   ```bash
   # Windows (se instalou como serviço, já roda automaticamente)
   # Ou inicie manualmente:
   mongod --dbpath "C:\data\db"

   # macOS / Linux:
   brew services start mongodb-community
   # ou
   sudo systemctl start mongod
   ```

3. **Verificar conexão:**
   ```bash
   mongosh
   # Deve abrir o shell do MongoDB
   ```

4. **String de conexão para .env:**
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/wedding-renan-heloisa
   ```

### Opção B: MongoDB Atlas (produção / nuvem)

1. **Criar conta gratuita:** [MongoDB Atlas](https://www.mongodb.com/atlas)

2. **Criar um cluster:**
   - Escolha o plano **Shared (Free)** para desenvolvimento
   - Região: São Paulo (sa-east-1) se disponível

3. **Configurar acesso:**
   - Em **Database Access**: criar usuário com senha
   - Em **Network Access**: adicionar IP `0.0.0.0/0` (dev) ou IPs específicos (produção)

4. **Obter connection string:**
   - Clique em **Connect** → **Drivers** → copie a URI
   - Substitua `<password>` pela senha do usuário

5. **String de conexão para .env:**
   ```
   MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/wedding-renan-heloisa?retryWrites=true&w=majority
   ```

---

## 2️⃣ Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Conexão MongoDB (veja seção acima)
MONGODB_URI=mongodb://127.0.0.1:27017/wedding-renan-heloisa

# Secret do Payload (OBRIGATÓRIO mudar em produção!)
# Gere um valor aleatório com:
#   PowerShell: [System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()
#   Linux/Mac: openssl rand -hex 32
PAYLOAD_SECRET=seu-secret-aleatorio-aqui

# URL base do servidor
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

---

## 3️⃣ Instalação e Execução

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev

# O site estará em: http://localhost:3000
# O painel admin (Payload): http://localhost:3000/admin
```

### Primeiro acesso ao Payload Admin

1. Acesse `http://localhost:3000/admin`
2. Na primeira vez, o Payload pedirá para **criar o primeiro usuário admin**
3. Preencha email e senha — esse será o administrador principal
4. Após login, você verá o dashboard com as collections

---

## 4️⃣ Configurar o Site via Payload Admin

### Configurações do Site (Site Settings)

1. No menu lateral, clique em **"Configurações do Site"** (global)
2. O global está organizado em **Tabs** para facilitar a navegação:
   - **Casal e Data**:
     - **Nome do Casal** (ex: Renan & Heloisa)
     - **Nome completo do noivo**
     - **Nome completo da noiva**
     - **Data do Casamento**
     - **Exibir Contagem Regressiva**
   - **Cores**: ajuste as cores primária, secundária, de destaque, textos e fundo
   - **Fontes**: escolha Google Font ou upload customizado
   - **Pagamento**: método (ex: Pix), link padrão e instruções
   - **SEO**: título do site, descrição e imagem Open Graph
3. Sempre que alguma seção exibir a mensagem **"Inserir no seu painel"**, significa que falta cadastrar mídia/campo no Payload para aquele bloco.

### Upload de Mídias

1. Vá em **"Media"** no menu lateral
2. Clique em **"Create New"**
3. Faça upload de imagens/vídeos
4. Preencha o texto alternativo (obrigatório)

**Formatos aceitos:**
- Imagens: JPG, PNG, WebP, AVIF, SVG
- Vídeos: MP4, WebM

### Background Media (Imagens de Fundo)

1. Vá em **"Background Media"**
2. Para cada seção do site (Hero, Meio, etc.):
   - Selecione a mídia já enviada
   - Escolha a localização (Hero, Middle, etc.)
   - Ative/desative conforme necessário

### Galeria Vertical (Skiper30)

1. Vá em **"Vertical Carousel Media"**
2. Adicione cada imagem e defina a ordem numérica
3. Ative apenas as que devem aparecer

### Lista de Presentes

1. Vá em **"Gift List"**
2. Adicione cada presente com:
   - Título, subtítulo, preço
   - Imagem (selecione da Media)
   - Link de pagamento (opcional — se vazio, usa o padrão das configurações)

### Convidados

1. Vá em **"Guests"**
2. Adicione cada convidado com nome, email, telefone
3. Adicione acompanhantes (nome, idade, tipo)
4. Marque como confirmado quando necessário

---

## 5️⃣ Build para Produção

```bash
# Build
pnpm build

# Iniciar em produção
pnpm start
```

---

## 6️⃣ Deploy (Recomendações)

### Vercel (Recomendado para Next.js)

1. Conecte o repositório GitHub na [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente no painel da Vercel
3. Use MongoDB Atlas para o banco de dados

### Variáveis de ambiente em produção:

```
MONGODB_URI=mongodb+srv://...
PAYLOAD_SECRET=<valor-aleatorio-forte>
NEXT_PUBLIC_SERVER_URL=https://seu-dominio.com
```

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── (payload)/          # Rotas do Payload CMS (admin + API)
│   │   ├── admin/          # Dashboard admin
│   │   └── api/            # REST + GraphQL endpoints
│   ├── (site)/             # Rotas públicas do site
│   │   ├── lista-de-presentes/
│   │   ├── rsvp/
│   │   ├── layout.tsx      # Layout público (SEO dinâmico)
│   │   └── page.tsx        # Página inicial
│   └── globals.css
├── collections/            # Payload collections (Guests, GiftList, etc.)
├── globals/                # Payload globals (SiteSettings)
├── components/
│   ├── payload/            # Componentes do dashboard Payload
│   ├── hooks/              # Custom hooks tipados
│   ├── ui/                 # UI primitives (Button, Card, etc.)
│   ├── dividers/           # Componentes decorativos
│   └── masonry/            # Galeria masonry
├── lib/
│   ├── api.ts              # Camada de API centralizada (Payload fetch)
│   └── utils.ts            # Utilitários (countdown, formatPrice, etc.)
├── types/
│   └── index.ts            # Tipos centralizados
└── payload.config.ts       # Configuração principal do Payload
```

---

## ❓ Troubleshooting

| Problema | Solução |
|----------|---------|
| `MONGODB_URI not configured` | Verifique o arquivo `.env` |
| Payload admin não carrega | Verifique se MongoDB está rodando |
| Imagens não aparecem | Verifique upload na collection Media |
| Erro de CORS | Configure `NEXT_PUBLIC_SERVER_URL` corretamente |
| `pnpm install` falha | Tente `pnpm install --no-frozen-lockfile` |
