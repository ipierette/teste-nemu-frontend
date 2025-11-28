<div align="center">

# 🎨 Frontend - Plataforma de Análise de Jornada

### Interface moderna em React + Vite + Tailwind CSS

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Icons](https://img.shields.io/badge/React_Icons-5.x-E91E63?style=flat-square&logo=react&logoColor=white)](https://react-icons.github.io/react-icons/)

### 🚀 Deploy

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://teste-nemu-frontend.vercel.app)

**URL de Produção:** [https://teste-nemu-frontend.vercel.app](https://teste-nemu-frontend.vercel.app)

</div>

---

## 📖 Sobre

Interface moderna e responsiva para visualização de jornadas de usuário. Desenvolvida com React 18, Vite para build rápido, Tailwind CSS para estilização, e React Icons para ícones vetoriais.

## ⚡ Início Rápido

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

Acesse em `http://localhost:5173`

---

## ✨ Funcionalidades

### 🎯 Core
- ✅ Visualização de jornadas em tempo real via API
- ✅ Modos de visualização: Tabela e Cards
- ✅ Dark Mode / Light Mode com persistência (Tailwind v4)
- ✅ Dashboard de estatísticas com 5 cards gradient
- ✅ Sistema dual de modais (jornada tratada vs original)
- ✅ Separação clara de dados reais vs mock
- ✅ Ordenação por data de criação (asc/desc)

### 🎨 UI/UX
- ✅ Design responsivo para mobile, tablet e desktop
- ✅ Skeleton loaders durante carregamento
- ✅ Animações suaves e transições
- ✅ Estados de erro com retry
- ✅ Empty states informativos
- ✅ Ícones Material Design (React Icons)
- ✅ Background canvas interativo com 50 partículas
- ✅ Footer com informações da desenvolvedora

### 🎨 Sistema de Cores (16 Canais)
- google (azul), facebook (índigo), instagram (rosa)
- organic (verde), virginia (laranja), sitebotão/sitebotaobio (roxo)
- mailbiz (vermelho), diamaes (ciano), colecaoinverno (teal)
- saleatacado (âmbar), freteday (lima), eurolinkbio (esmeralda)
- anapaula (fúcsia), facebookads (violeta), youtube (roxo), whatsapp (verde)
- Todos com variantes para dark mode

### 📊 Visualizações

**Modo Tabela:**
- Colunas: ID, Criado Em, Jornada (touchpoints), Touchpoints (contagem)
- Ordenação por data (crescente/decrescente)
- Ver mais: modal com jornada tratada (removeMiddleDuplicates aplicado)
- Ver completo: modal com jornada original sem tratamento
- Scroll horizontal responsivo
- Truncamento automático para >5 touchpoints

**Modo Cards:**
- Layout em grid responsivo (1/2/3 colunas)
- Visualização compacta por jornada
- Timeline de touchpoints com cores
- Badges coloridos por canal
- Botões duais: "Ver mais" (tratada) + "Ver completo" (original)

**Dashboard de Estatísticas:**
- 5 cards gradient: Valor Total, Vendas, Ticket Médio, Jornadas, Tempo Médio
- Toggle show/hide para estatísticas
- Banner informativo separando dados reais vs mock:
  - 📊 Dados Reais: ID, Criado Em, Touchpoints, Duração
  - 📈 Dados Mock: Valor Total, Vendas, Ticket Médio, Percentual

---

## 📂 Estrutura do Projeto

```
src/
├── components/
│   └── ThemeToggle.jsx         # Toggle dark/light mode
├── styles/
│   └── globals.css             # Estilos globais + Tailwind
├── App.jsx                     # Componente principal
└── main.jsx                    # Entry point
```

---

## 🚀 Stack Tecnológica

| Tecnologia | Versão | Propósito |
|------------|--------|-----------||
| **React** | 19.2 | UI library |
| **Vite** | 7.2 | Build tool & dev server |
| **Tailwind CSS** | 4.1.17 | Utility-first CSS (v4 com @import) |
| **React Icons** | 5.x | Ícones Material Design |
| **PostCSS** | Latest | CSS transformations (@tailwindcss/postcss) |
| **ESLint** | 9.x | Linting |

---

## 🎨 Design System

### Cores (Tailwind CSS)

**Light Mode:**
```css
--background: 0 0% 100%       /* Branco */
--foreground: 222.2 84% 4.9%  /* Quase preto */
--primary: 221.2 83.2% 53.3%  /* Azul */
```

**Dark Mode:**
```css
--background: 222.2 84% 4.9%  /* Quase preto */
--foreground: 210 40% 98%     /* Quase branco */
--primary: 217.2 91.2% 59.8%  /* Azul mais claro */
```

### Ícones (React Icons - Material Design)

```jsx
import { 
  MdError,        // Erro
  MdInbox,        // Empty state
  MdBarChart,     // Estatísticas
  MdTimeline,     // Timeline
  MdAccessTime,   // Tempo
  MdTableChart,   // Modo tabela
  MdViewModule    // Modo cards
} from 'react-icons/md';
```

---

## 🔌 Integração com Backend

### API Base URL

```javascript
const API_BASE_URL = 'http://localhost:3001';
```

### Endpoints Consumidos

**GET /api/journeys**
```javascript
const loadJourneys = async () => {
  const response = await fetch(`${API_BASE_URL}/api/journeys`);
  const data = await response.json();
  
  if (data.success) {
    setJourneys(data.data);
    setStats(data.metadata);
  }
};
```

**Response Esperada:**
```json
{
  "success": true,
  "data": [
    {
      "sessionId": "session-abc",
      "userId": "user-xyz",
      "touchpoints": [...],
      "startTime": "2025-11-28T10:00:00.000Z",
      "endTime": "2025-11-28T10:15:00.000Z",
      "duration": 900000,
      "totalTouchpoints": 2
    }
  ],
  "metadata": {
    "totalJourneys": 150,
    "totalTouchpoints": 450,
    "processedAt": "2025-11-28T12:00:00.000Z"
  }
}
```

---

## 🔧 Configuração

### Tailwind Config v4

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class'
}
```

### PostCSS Config

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

### Globals CSS (Tailwind v4)

```css
/* src/styles/globals.css */
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
}
```

**Diferenças do Tailwind v4:**
- Usa `@import "tailwindcss"` ao invés de `@tailwind` directives
- Dark mode com `@variant dark` ao invés de `@layer`
- Não usa `@layer base` ou `@layer utilities`

### Vite Config

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

---

## 🎯 Componentes Principais

### App.jsx

Componente raiz que gerencia:
- Estado das jornadas (`journeys`)
- Estado de loading (`loading`)
- Estado de erro (`error`)
- Modo de visualização (`view`: 'table' | 'cards')
- Estatísticas (`stats`)

**Estados:**
```jsx
const [journeys, setJourneys] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [view, setView] = useState('table');
const [stats, setStats] = useState({});
```

### ThemeToggle.jsx

Gerencia tema dark/light:
```jsx
const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem('theme') === 'dark';
});

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}, [darkMode]);
```

### Sistema de Modais Duplos

**Modal 1 - Jornada Tratada (Tema Azul):**
```jsx
const [modalJourney, setModalJourney] = useState(null);

const openJourneyModal = (journey) => {
  setModalJourney(journey); // Journey com removeMiddleDuplicates aplicado
};
```
- Mostra touchpoints processados (duplicatas do meio removidas)
- Tema azul para identificação visual
- Acionado pelo botão "Ver mais"

**Modal 2 - Jornada Completa Original (Tema Verde):**
```jsx
const [modalCompleteJourney, setModalCompleteJourney] = useState(null);

const openCompleteJourneyModal = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/api/journeys`);
  const data = await response.json();
  const fullJourney = data.data.find(j => j.sessionId === sessionId);
  setModalCompleteJourney(fullJourney); // Journey original sem tratamento
};
```
- Mostra touchpoints originais (sem removeMiddleDuplicates)
- Tema verde para diferenciação
- Banner de aviso: "⚠️ Dados brutos sem tratamento de duplicatas"
- Acionado pelo botão "Ver completo"
- Permite validação e comparação do processamento

---

## 📱 Responsividade

### Breakpoints

| Breakpoint | Largura | Dispositivo |
|------------|---------|-------------|
| `sm` | 640px+ | Mobile grande |
| `md` | 768px+ | Tablet |
| `lg` | 1024px+ | Laptop |
| `xl` | 1280px+ | Desktop |
| `2xl` | 1536px+ | Desktop grande |

### Exemplos de Uso

```jsx
// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  
// Padding adaptativo
<div className="p-4 md:p-6 lg:p-8">

// Texto responsivo
<h1 className="text-2xl md:text-3xl lg:text-4xl">
```

---

## 🎨 Estados da UI

### Loading (Skeleton)

```jsx
{loading && (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
)}
```

### Error

```jsx
{error && (
  <div className="text-center py-12">
    <MdError className="mx-auto text-6xl text-red-500" />
    <p className="mt-4 text-gray-600 dark:text-gray-400">{error}</p>
    <button onClick={loadJourneys}>Tentar Novamente</button>
  </div>
)}
```

### Empty State

```jsx
{journeys.length === 0 && (
  <div className="text-center py-12">
    <MdInbox className="mx-auto text-6xl text-gray-300" />
    <p className="mt-4 text-gray-500">Nenhuma jornada encontrada</p>
  </div>
)}
```

---

## 🧪 Testes

### Teste Manual

1. **Iniciar Backend:**
   ```bash
   cd teste-nemu-back && npm run dev
   ```

2. **Iniciar Frontend:**
   ```bash
   cd teste-nemu-front && npm run dev
   ```

3. **Verificações:**
   - ✅ Página carrega em `http://localhost:5173`
   - ✅ Estilos Tailwind aplicados
   - ✅ Dark mode funciona
   - ✅ Dados carregam da API
   - ✅ Troca de visualização funciona
   - ✅ Ícones aparecem corretamente

---

## 🚨 Solução de Problemas

### Estilos não aparecem

```bash
# Verificar se globals.css está importado em main.jsx
# Deve conter: import './styles/globals.css'

# Rebuild do Tailwind
npm run dev
```

### API não responde

```bash
# Verificar se backend está rodando
curl http://localhost:3001/health

# Verificar CORS no backend
# Deve ter: app.use(cors())
```

### Erro de build

```bash
# Limpar cache
rm -rf node_modules
rm -rf dist
npm install
npm run build
```

### Dark mode não persiste

```javascript
// Verificar localStorage
localStorage.getItem('theme') // Deve retornar 'dark' ou 'light'
```

---

## 📚 Referências

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Icons](https://react-icons.github.io/react-icons/)

---

<div align="center">

**Desenvolvido com 💙 por Izadora Cury Pierette**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Conectar-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/izadora-cury-pierette-7a7754253/)
[![GitHub](https://img.shields.io/badge/GitHub-Seguir-181717?style=flat-square&logo=github)](https://github.com/ipierette)
[![Email](https://img.shields.io/badge/Email-Contato-EA4335?style=flat-square&logo=gmail)](mailto:ipierette2@gmail.com)

</div>

## Stack Tecnológica

### Backend
| Tecnologia | Propósito |
|------------|-----------|
| **Node.js** | Ambiente de execução |
| **TypeScript** | Segurança de tipo e melhor DX |
| **Express** | Framework web |
| **XLSX** | Análise de arquivos Excel |
| **Zod** | Validação de schema |
| **CORS** | Compartilhamento de recursos entre origens |

### Frontend
| Tecnologia | Propósito |
|------------|-----------|
| **React 18** | Biblioteca de UI |
| **Vite** | Ferramenta de build e servidor de desenvolvimento |
| **Tailwind CSS** | Estilização utility-first |
| **JavaScript (ES6+)** | Lógica de aplicação |
| **Fetch API** | Requisições HTTP |

---

## Instalação

### Pré-requisitos
- Node.js 18+ e npm
- Git

### Configuração do Backend

```bash
cd teste-nemu-back
npm install
npm run dev
```

O servidor backend iniciará em `http://localhost:3001`

### Configuração do Frontend

```bash
cd teste-nemu-front
npm install
npm run dev
```

A aplicação frontend iniciará em `http://localhost:5173`

---

## Documentação da API

### URL Base
```
http://localhost:3001
```

### Endpoints

#### GET /health
Endpoint de verificação de saúde

**Resposta:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-28T12:00:00.000Z"
}
```

#### GET /api/journeys
Retorna todas as jornadas de usuário processadas

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "sessionId": "session-123",
      "userId": "user-456",
      "touchpoints": [
        {
          "channel": "email",
          "timestamp": "2025-11-28T10:00:00.000Z"
        },
        {
          "channel": "web",
          "timestamp": "2025-11-28T10:15:00.000Z"
        }
      ],
      "startTime": "2025-11-28T10:00:00.000Z",
      "endTime": "2025-11-28T10:15:00.000Z",
      "duration": 900000,
      "totalTouchpoints": 2
    }
  ],
  "metadata": {
    "totalJourneys": 1,
    "totalTouchpoints": 2,
    "processedAt": "2025-11-28T12:00:00.000Z"
  }
}
```

**Resposta de Erro:**
```json
{
  "success": false,
  "error": {
    "message": "Descrição do erro"
  }
}
```

---

## Estrutura do Projeto

### Backend
```
teste-nemu-back/
├── src/
│   ├── controllers/
│   │   └── journeys.controller.ts
│   ├── middlewares/
│   │   └── errorHandler.ts
│   ├── routes/
│   │   └── journeys.routes.ts
│   ├── services/
│   │   └── journeys.service.ts
│   ├── types/
│   │   ├── Journey.ts
│   │   └── RawEvent.ts
│   ├── utils/
│   │   ├── groupBySession.ts
│   │   ├── parseXlsx.ts
│   │   ├── removeMiddleDuplicates.ts
│   │   └── sortByDate.ts
│   └── server.ts
├── nemu-base-de-dados.xlsx
├── package.json
└── tsconfig.json
```

### Frontend
```
teste-nemu-front/
├── src/
│   ├── components/
│   │   ├── JourneyCard.jsx
│   │   ├── JourneyRow.jsx
│   │   ├── JourneyTable.jsx
│   │   └── ThemeToggle.jsx
│   ├── hooks/
│   │   └── useTheme.js
│   ├── lib/
│   │   └── fetchJourneys.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Regras de Negócio

O processamento da jornada segue estas regras específicas:

1. **Agrupamento**: Eventos são agrupados por `sessionId`
2. **Ordenação**: Dentro de cada sessão, eventos são ordenados por timestamp `created_at`
3. **Desduplicação**: Canais duplicados consecutivos são removidos do meio das jornadas
   - Primeiro ponto de contato é sempre mantido
   - Último ponto de contato é sempre mantido
   - Apenas duplicatas do meio são removidas
4. **Limites da Jornada**: Jornada começa no primeiro evento e termina no último evento
5. **Validação**: Todos os dados são validados contra schemas rigorosos antes do processamento

---

## Scripts

### Backend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Iniciar servidor de desenvolvimento com hot reload |
| `npm run build` | Compilar TypeScript para JavaScript |
| `npm start` | Iniciar servidor de produção |
| `npm run type-check` | Executar verificação de tipo TypeScript |

### Frontend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Iniciar servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run preview` | Pré-visualizar build de produção |

---

## Funcionalidades em Detalhes

### Modo Escuro
- Detecção de preferência do sistema
- Alternância manual com armazenamento persistente
- Transições suaves entre temas
- Esquemas de cores personalizados para ambos os modos

### Design Responsivo
- Abordagem mobile-first
- Breakpoints para tablets e desktops
- Tabela com scroll horizontal em telas pequenas
- Visualização em card otimizada para mobile

### Tratamento de Erros
- Erros de validação do backend
- Tratamento de erros de rede
- Mensagens de erro amigáveis ao usuário
- Funcionalidade de tentar novamente

### Performance
- Carregamento lazy de componentes
- Re-renderizações otimizadas
- Tamanho de bundle mínimo com Vite
- Processamento eficiente de dados

---

## Desenvolvedora

<div align="center">

### Izadora Cury Pierette

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Conectar-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/izadora-cury-pierette-7a7754253/)
[![GitHub](https://img.shields.io/badge/GitHub-Seguir-black?style=for-the-badge&logo=github)](https://github.com/ipierette)
[![Email](https://img.shields.io/badge/Email-Contato-red?style=for-the-badge&logo=gmail)](mailto:ipierette2@gmail.com)

</div>

---

## Licença

Este projeto está licenciado sob a Licença MIT.

---

<div align="center">

**Construído com paixão por código limpo e excelente experiência do usuário**

⭐ Favorite este projeto se o achou útil!

</div>
