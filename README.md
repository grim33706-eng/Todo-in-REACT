# Taskflow — React Todo App

A polished todo app built with React 19, Vite, Framer Motion and Lucide icons.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

## Features

- Add (Enter or button), inline edit (button or double-click; Enter saves, Esc cancels), delete with **Undo**, toggle complete
- Filters (All / Active / Completed), live stats and a progress ring
- Clear completed with a confirmation dialog
- Input validation (empty / over 200 characters), whitespace normalised
- Tasks, theme and active filter persisted in `localStorage` (corrupt data is ignored safely; tabs stay in sync)
- Light / dark theme (defaults to the system preference, no flash on load)
- Toast notifications, created/edited timestamps
- Subtle 3D: tilting stat cards with glare, layered panel depth, 3D entrance/exit animations, floating background shapes
- Accessible: keyboard shortcuts (`/` focuses the input), visible focus rings, ARIA labels, focus-trapped dialog, honours `prefers-reduced-motion`

## Structure

```
src/
  App.jsx                 app composition and handlers
  hooks/                  useTodos (reducer + persistence), useTheme, useToasts, useNow
  utils/                  storage helpers, validation and formatting
  components/             Header, TodoStats, TodoForm, TodoFilters, TodoList, TodoItem,
                          EmptyState, ConfirmDialog, Toaster, TiltCard, Background
  index.css               design tokens, themes and component styles
```
