# Site-IFGNU

Plataforma unificada para o **IF GNU**, focada na gestão completa de projetos (submissão, acompanhamento, gestão de bolsistas/voluntários e métricas).

---

## 🚀 Tecnologias

- **Frontend**: Vanilla JavaScript (ES Modules, Web Components)
- **Estilização**: CSS3 com Custom Properties (Design Tokens)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Container**: Docker + Nginx

---

## 🛠️ Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18+ recomendada)
- `npm` (gerenciador de pacotes)
- *(Opcional)* Docker e Docker Compose

---

## 💻 Como Executar

### 1. Modo Desenvolvimento (Vite)

Instale as dependências:
```bash
npm install
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse no navegador:
```text
http://localhost:3000
```

---

### 2. Build de Produção

Para gerar os arquivos estáticos otimizados na pasta `dist/`:
```bash
npm run build
```

Para pré-visualizar a build de produção localmente:
```bash
npm run preview
```

---

### 3. Via Docker (Produção)

Construa a imagem e suba os containers:
```bash
docker compose up -d --build
```

Acesse:
```text
http://localhost:9002
```

Para parar o container:
```bash
docker compose down
```

