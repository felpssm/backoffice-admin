# Backoffice Administrativo

Sistema de gestão administrativa desenvolvido como parte do teste técnico para vaga de Frontend.

Stacks Obrigatórias:

- React
- TypeScript
- shadcn/ui
- Tailwind CSS
- Fetch ou Axios
- JSON local simulando backend

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js versão 18 ou superior
- npm, yarn ou pnpm

### Instalação

```bash
# Clone o repositório ou extraia o projeto
cd backoffice-admin

# Instale as dependências
npm install

# Rode o projeto em modo desenvolvimento
npm run dev
```

O projeto será aberto automaticamente em `http://localhost:5173`

### Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Preview do build de produção
npm run lint     # Executa o ESLint
```

## 📂 Estrutura de Pastas

Organizei o projeto seguindo uma estrutura por feature/domínio, o que facilita a escalabilidade e manutenção:

```
src/
├── components/
│   ├── ui/                    # Componentes base do shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── alert.tsx
│   ├── dashboard/             # Componentes específicos do dashboard
│   │   └── Dashboard.tsx
│   ├── users/                 # Tudo relacionado a usuários
│   │   ├── UsersList.tsx
│   │   └── UserDetail.tsx
│   ├── orders/                # Tudo relacionado a pedidos
│   │   ├── OrdersList.tsx
│   │   └── OrderDetail.tsx
│   ├── commissions/           # Tudo relacionado a comissões
│   │   └── Commissions.tsx
│   └── Layout.tsx             # Layout principal com sidebar
├── data/                      # JSONs que simulam API
│   ├── users.json
│   ├── orders.json
│   └── commissions.json
├── hooks/                     # Custom hooks
│   └── useData.ts
├── lib/                       # Funções utilitárias
│   └── utils.ts
├── types/                     # Definições TypeScript
│   └── index.ts
├── App.tsx                    # Rotas principais
├── main.tsx                   # Entry point
└── index.css                  # Estilos globais + Tailwind
```

### Por que essa organização?

Escolhi separar por features porque:

- Facilita encontrar componentes relacionados
- Permite escalar o projeto adicionando novas features sem bagunça
- Componentes UI reutilizáveis ficam isolados em `ui/`
- Cada feature é independente e pode ser trabalhada separadamente

## 🔄 Consumo e Manipulação de Dados

### Arquivos JSON

Criei três arquivos JSON na pasta `src/data/` que simulam respostas de uma API:

- **users.json**: 8 usuários com diferentes roles (admin, seller, customer)
- **orders.json**: 7 pedidos com itens e valores
- **commissions.json**: 4 comissões vinculadas a vendedores e pedidos

### Relacionamentos

Implementei relacionamentos simples através de IDs:

- `Order.userId` → `User.id`
- `Commission.userId` → `User.id`
- `Commission.orderId` → `Order.id`

### Custom Hooks

Criei o arquivo `hooks/useData.ts` com três hooks customizados:

```typescript
useUsers(); // Carrega e gerencia usuários
useOrders(); // Carrega e gerencia pedidos
useCommissions(); // Carrega e gerencia comissões
```

Cada hook:

1. Usa Axios para buscar o JSON (simulando fetch de API)
2. Adiciona um delay de 500ms para simular latência de rede
3. Gerencia estados de loading, error e data
4. Fornece métodos para atualizar dados localmente

### Exemplo de Uso

```typescript
const { data: users, loading, error, updateUser } = useUsers();

// Atualizar um usuário
const updatedUser = { ...user, name: "Novo Nome" };
updateUser(updatedUser);
```

### Limitação Importante

As alterações **não persistem** após reload da página. Tudo fica apenas em memória durante a sessão.

## 🎯 Decisões Técnicas

### Stack Escolhida

Segui exatamente o que foi pedido no teste:

- **React 18**: Funcionalidades modernas com hooks
- **TypeScript**: Tipagem forte em todo o projeto
- **shadcn/ui**: Componentes prontos e acessíveis
- **Tailwind CSS**: Estilização rápida e consistente
- **Axios**: Para requisições (mesmo sendo JSON local)
- **React Router**: Navegação entre páginas

### Padrões Implementados

**1. Tipagem Forte**

- Criei interfaces para todas as entidades (User, Order, Commission)
- Tipos para status e roles
- Props de componentes sempre tipadas

**2. Componentes Funcionais**

- Uso exclusivo de hooks (useState, useEffect)
- Componentes pequenos e focados
- Separação de lógica e apresentação

**3. Estado Local**

- Não usei Context API porque o projeto é pequeno
- Props drilling é gerenciável nesse tamanho
- Se crescesse, migraria para Zustand ou Context

**4. Simulação Realista de API**

- Delay artificial nas requisições
- Estados de loading e error
- Tratamento de erros com try/catch

### Componentes shadcn/ui

Implementei manualmente os componentes do shadcn/ui:

- Button (com variantes)
- Card (com Header, Content, Footer)
- Badge (para status)
- Input e Select
- Table (completa com Header, Body, Row, Cell)
- Alert (para feedback)

Preferi criar os componentes ao invés de usar o CLI do shadcn porque:

- Tenho controle total do código
- Sei exatamente o que cada componente faz
- Facilita customizações futuras

## ✨ Funcionalidades Implementadas

### Dashboard

- 5 cards com métricas calculadas em tempo real
- Total de usuários, usuários ativos, pedidos, valores

### Usuários

**Listagem:**

- Busca por nome ou email
- Filtro por status (ativo/inativo)
- Filtro por role (admin/seller/customer)
- Botão para ativar/desativar direto na linha
- Click na linha navega para detalhes

**Detalhes:**

- Formulário para editar nome e email
- Toggle de status com botão grande
- Feedback visual ao salvar (Alert verde)
- Validação básica dos campos

### Pedidos

**Listagem:**

- Filtro por status
- Ordenação por data ou valor (crescente/decrescente)
- Mostra nome do usuário relacionado
- Click navega para detalhes

**Detalhes:**

- Tabela completa de itens
- Cálculo automático de totais
- Dropdown para mudar status
- Card com dados do usuário relacionado
- Recalcula valores ao salvar

### Comissões

- 3 cards totalizadores (geral, pendente, paga)
- Filtro por status
- Tabela com vendedor e pedido relacionado
- Cores diferentes por status (verde/amarelo)

### Estados Implementados

Em todas as telas implementei:

- **Loading**: Spinner animado enquanto carrega
- **Empty State**: Mensagem quando não há dados
- **Error State**: Feedback vermelho se der erro
- **Success**: Alert verde após salvar alterações

### Melhorias Futuras

**Curto Prazo:**

- [ ] Adicionar validação completa de formulários
- [ ] Implementar paginação nas tabelas
- [ ] Melhorar responsividade mobile
- [ ] Adicionar loading skeletons
- [ ] Toasts ao invés de Alerts

**Médio Prazo:**

- [ ] Conectar com backend real (Node.js + Express)
- [ ] Implementar autenticação JWT
- [ ] Adicionar testes com Vitest
- [ ] Criar Storybook dos componentes
- [ ] Modo escuro

**Longo Prazo:**

- [ ] Dashboard com gráficos (Recharts)
- [ ] Exportar dados para CSV/PDF
- [ ] Notificações em tempo real (WebSocket)
- [ ] Upload de imagens
- [ ] Histórico de alterações

## 📄 Licença

Projeto desenvolvido para fins de avaliação técnica.

**Desenvolvido por Felipe Ferreira**
**Tempo de desenvolvimento: 12 horas**
**Data: Fevereiro 2025**
