# 📚 Guia de Boas Práticas para o Projeto

Um documento prático com as melhores práticas aplicadas no projeto.

---

## 🎯 Princípios Fundamentais

### 1. **Single Responsibility Principle (SRP)**
Cada arquivo/função deve ter uma única razão para mudar.

```typescript
// ❌ Ruim: Muitas responsabilidades
function fetchAndFilterAndSortAndPaginateRepos() {
  // 100+ linhas fazendo tudo
}

// ✅ Bom: Responsabilidades separadas
// - page.tsx: Orquestra o componente
// - projects-utils.ts: Funções de negócio
// - useNeighborWindow.ts: Lógica de responsividade
// - ProjectsControls.tsx: UI de controle
```

---

## 📝 Documentação

### Sempre use JSDoc para funções públicas

```typescript
/**
 * Breve descrição do que a função faz
 * @param paramName - O que esse parâmetro faz
 * @returns O que é retornado
 * @example
 * const result = myFunction("value");
 */
export function myFunction(paramName: string): string {
  // ...
}
```

---

## 🏗️ Estrutura de Arquivos

### Organize seu projeto por features/domain

```
src/
├── app/
│   ├── projects/
│   │   ├── page.tsx                    # Componente principal
│   │   ├── [slug]/
│   │   ├── useNeighborWindow.ts        # Custom hooks
│   │   ├── ProjectsStateComponents.tsx # Componentes de estado
│   │   ├── ProjectsControls.tsx        # Componentes de controle
│   │   └── ProjectCard.tsx             # Componentes específicos
│   ├── articles/
│   ├── about/
│   └── layout.tsx
├── components/                          # Componentes globais
├── lib/
│   ├── projects-utils.ts               # Utilidades do domínio
│   └── articles.ts
└── styles/
```

---

## ⚡ Performance

### Use memoization para cálculos custosos

```typescript
// ❌ Ruim: Recalcula a cada render
const filtered = repos.filter(...);

// ✅ Bom: Só recalcula quando dependências mudam
const filtered = useMemo(() => {
  return repos.filter(...);
}, [repos, query, sort]);
```

### Renderização condicional

```typescript
// ❌ Ruim: Sempre renderiza a paginação
<Pagination {...props} />

// ✅ Bom: Só renderiza quando necessária
{totalPages > 1 && <Pagination {...props} />}
```

---

## 🎨 Nomes Descritivos

```typescript
// ❌ Ruim
const q = query.trim().toLowerCase();
const hay = `${r.name} ${r.description ?? ""}`.toLowerCase();
const mqMd = window.matchMedia("(min-width: 768px)");

// ✅ Bom
const searchQuery = query.trim().toLowerCase();
const searchText = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
const mdMediaQuery = window.matchMedia(BREAKPOINTS.md);
```

---

## 🔒 Type Safety

### Use TypeScript rigorosamente

```typescript
// ❌ Ruim: Tipos implícitos
function handleChange(e) {
  const value = e.target.value;
  // ...
}

// ✅ Bom: Tipos explícitos
function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
  const value = e.target.value;
  // ...
}
```

### Crie interfaces para props

```typescript
// ❌ Ruim
function MyComponent(props: any) {}

// ✅ Bom
interface MyComponentProps {
  title: string;
  onClick: (id: number) => void;
  optional?: boolean;
}

function MyComponent({ title, onClick, optional }: MyComponentProps) {}
```

### Use type guards

```typescript
const SORT_OPTIONS = ["recent", "stars", "az"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

export function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

// Uso
if (isSortOption(userInput)) {
  // TypeScript agora sabe que userInput é SortOption
}
```

---

## 🧪 Testabilidade

### Extraia lógica de componentes

```typescript
// ✅ Bom: Fácil de testar
export function parseEmojis(text: string | null): string {
  if (!text) return "";
  return text.replace(/:[\w?]+:/g, (match) => EMOJI_MAP[match] || match);
}

// Fácil de testar em isolamento
describe("parseEmojis", () => {
  test("should convert emoji codes to emojis", () => {
    expect(parseEmojis(":rocket:")).toBe("🚀");
  });
});
```

---

## ♿ Acessibilidade (a11y)

### Sempre adicione labels e aria attributes

```typescript
// ❌ Ruim
<input placeholder="Buscar..." />

// ✅ Bom
<input
  placeholder="Buscar por nome ou descrição…"
  aria-label="Buscar repositórios"
/>
```

### Use semantic HTML

```typescript
// ❌ Ruim
<div onClick={handleClick} role="button">Clique</div>

// ✅ Bom
<button onClick={handleClick}>Clique</button>
```

### Pagination aria attributes

```typescript
<button
  onClick={() => setCurrentPage(page)}
  aria-current={page === currentPage ? "page" : undefined}
>
  {page}
</button>
```

---

## 🚨 Error Handling

### Forneça mensagens de erro descritivas

```typescript
// ❌ Ruim
if (!res.ok) throw new Error("Erro");

// ✅ Bom
if (!response.ok) {
  throw new Error(
    `GitHub API error: ${response.status} ${response.statusText}`
  );
}
```

### Log errors adequadamente

```typescript
catch (err) {
  console.error("Failed to fetch repositories:", err);
  setError(true);
}
```

---

## 📦 Constantes

### Centralize valores hardcoded

```typescript
// ❌ Ruim: Valores espalhados
const res = await fetch("https://api.github.com/users/...");
if (repos.length > 6) { ... }

// ✅ Bom: Constantes no topo
const GITHUB_API_URL = "https://api.github.com/users/guilhermeportella/repos?sort=pushed&per_page=100";
const PROJECTS_PER_PAGE = 6;

const res = await fetch(GITHUB_API_URL);
if (repos.length > PROJECTS_PER_PAGE) { ... }
```

---

## 💬 Comentários

### Comentários explicam o "POR QUÊ", não o "O QUÊ"

```typescript
// ❌ Ruim: Óbvio
const filtered = repos.filter(...); // Filtra repositórios

// ✅ Bom: Explica decisão de design
// Reset to first page when query changes - UX improvement
const handleQueryChange = (newQuery: string) => {
  setQuery(newQuery);
  setCurrentPage(1);
};
```

### Organize componentes com comentários visuais

```typescript
return (
  <main>
    {/* Header Section */}
    <header>...</header>

    {/* Search and Sort Controls */}
    <SortFilter {...props} />

    {/* Content States */}
    {loading ? <Skeleton /> : error ? <Error /> : <Content />}

    {/* Footer */}
    <Footer />
  </main>
);
```

---

## 🔄 State Management

### Organize estado logicamente

```typescript
// ✅ Bom: Agrupado por contexto
// Data
const [repos, setRepos] = useState<Repo[]>([]);

// UI State
const [currentPage, setCurrentPage] = useState(1);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

// Filters
const [query, setQuery] = useState("");
const [sort, setSort] = useState<SortOption>(DEFAULT_SORT);
```

---

## 🎯 Code Review Checklist

Quando revisar código, verifique:

- [ ] Todos os componentes têm JSDoc?
- [ ] Nomes são descritivos?
- [ ] Há tipos TypeScript apropriados?
- [ ] Responsabilidade única por arquivo?
- [ ] Constantes centralizadas?
- [ ] Performance otimizada (useMemo, useCallback)?
- [ ] Acessibilidade implementada?
- [ ] Tratamento de erro adequado?
- [ ] Código testável?
- [ ] Sem console.log em produção?

---

## 🚀 Quick Wins para Melhorar Qualidade

1. **Adicione eslint rules** - Enforce code style
2. **Configure prettier** - Auto-format code
3. **Escreva testes** - Jest + React Testing Library
4. **Use Storybook** - Document components
5. **Implemente husky** - Pre-commit hooks
6. **Adicione pre-commit linting** - Evite código ruim
7. **Mantenha TypeScript strict** - `"strict": true`
8. **Revise código com cheklist** - Padronize qualidade

---

## 📚 Recursos Recomendados

- [Clean Code by Robert C. Martin](https://www.goodreads.com/book/show/3735293-clean-code)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
