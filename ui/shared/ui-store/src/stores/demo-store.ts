import { create } from 'zustand'

export interface Todo {
  id: string
  text: string
  completed: boolean
}

export interface DemoState {
  count: number
  theme: 'light' | 'dark'
  todos: Todo[]
  increment: () => void
  decrement: () => void
  resetCount: () => void
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  removeTodo: (id: string) => void
}

export const useDemoStore = create<DemoState>((set) => ({
  count: 0,
  theme: 'light',
  todos: [
    { id: '1', text: 'Initialize Zustand store package', completed: true },
    { id: '2', text: 'Connect store to React App dashboard', completed: false },
    { id: '3', text: 'Celebrate with the team!', completed: false },
  ],
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  resetCount: () => set({ count: 0 }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setTheme: (theme) => set({ theme }),
  addTodo: (text) =>
    set((state) => ({
      todos: [
        ...state.todos,
        { id: Math.random().toString(36).substring(7), text, completed: false },
      ],
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
}))
