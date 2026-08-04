import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Input } from '@/components/ui/input.tsx'
import { api, authClient } from '@workspace/ui-clients'
import { useDemoStore } from '@workspace/ui-store'
import {
  Plus,
  Trash2,
  Sun,
  Moon,
  PlusCircle,
  MinusCircle,
  RotateCcw,
} from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  const {
    count,
    theme,
    todos,
    increment,
    decrement,
    resetCount,
    toggleTheme,
    addTodo,
    toggleTodo,
    removeTodo,
  } = useDemoStore()

  const [newTodoText, setNewTodoText] = useState('')

  // Sync theme with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim())
      setNewTodoText('')
    }
  }

  useEffect(() => {
    if (!isPending && !session) {
      navigate({ to: '/login' })
    }
  }, [session, isPending, navigate])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.users.me.$get()
        if (res.ok) {
          const data = await res.json()
          console.log('Successfully fetched profile via RPC:', data.user?.email)
        }
      } catch (err) {
        console.error('Failed to fetch profile via RPC:', err)
      }
    }
    if (session) {
      fetchProfile()
    }
  }, [session])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base dark:bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect in useEffect
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      navigate({ to: '/login' })
    } catch (err) {
      console.error('Failed to sign out:', err)
    }
  }

  return (
    <div className="min-h-screen bg-base dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <header className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm border border-line">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {session.user.name}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 border border-line">
            <CardHeader className="flex flex-col items-center border-b border-line pb-6">
              <div className="w-20 h-20 bg-primary/10 text-primary flex items-center justify-center rounded-full text-2xl font-bold mb-4">
                {session.user.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <CardTitle className="text-lg">{session.user.name}</CardTitle>
              <CardDescription>{session.user.email}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified:</span>
                  <span
                    className={
                      session.user.emailVerified
                        ? 'text-green-600 font-semibold'
                        : 'text-yellow-600 font-semibold'
                    }
                  >
                    {session.user.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>
                    {new Date(session.user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 border border-line">
            <CardHeader>
              <CardTitle>Session Data</CardTitle>
              <CardDescription>
                Raw Better Auth session structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-auto max-h-60 border border-line">
                {JSON.stringify(session, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-line shadow-md overflow-hidden bg-card">
          <CardHeader className="bg-primary/5 border-b border-line pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">
                  Zustand Monorepo Store Demo
                </CardTitle>
                <CardDescription>
                  Demonstrates global, reactive state management via a shared
                  package
                </CardDescription>
              </div>
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 border border-line"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-sea-ink" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Counter Subsection */}
              <div className="flex flex-col gap-4 p-4 rounded-xl bg-muted/30 border border-line/40">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>🔢</span> Counter Store Slice
                </h3>
                <p className="text-sm text-muted-foreground">
                  Test reactivity. State changes update instantly across
                  components.
                </p>
                <div className="flex flex-col items-center justify-center p-6 bg-card rounded-lg border border-line/30 my-2">
                  <span className="text-5xl font-extrabold tracking-tight text-primary">
                    {count}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                    Current Count
                  </span>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={decrement}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <MinusCircle className="w-4 h-4" /> Decrement
                  </Button>
                  <Button
                    onClick={increment}
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" /> Increment
                  </Button>
                  <Button
                    onClick={resetCount}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-destructive hover:bg-destructive/10"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset
                  </Button>
                </div>
              </div>

              {/* Todo List Subsection */}
              <div className="flex flex-col gap-4 p-4 rounded-xl bg-muted/30 border border-line/40">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <span>✅</span> Todo List Store Slice
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add, toggle, or delete items. Persisted in volatile memory in
                  Zustand.
                </p>

                <form onSubmit={handleAddTodo} className="flex gap-2">
                  <Input
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="Create a new task..."
                    className="flex-1 animate-none"
                  />
                  <Button type="submit" size="sm" className="h-8">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </form>

                <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                  {todos.length === 0 ? (
                    <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-line/30 rounded-lg">
                      No tasks remaining!
                    </div>
                  ) : (
                    todos.map((todo) => (
                      <div
                        key={todo.id}
                        className={`flex justify-between items-center p-2.5 rounded-lg border transition-all ${
                          todo.completed
                            ? 'bg-muted/40 border-line/20 text-muted-foreground line-through'
                            : 'bg-card border-line/40 hover:border-primary/30'
                        }`}
                      >
                        <div
                          onClick={() => toggleTodo(todo.id)}
                          className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => {}} // handled by click
                            className="rounded border-input text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                          <span className="text-sm font-medium">
                            {todo.text}
                          </span>
                        </div>
                        <Button
                          onClick={() => removeTodo(todo.id)}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
