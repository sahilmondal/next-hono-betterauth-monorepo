"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@workspace/ui-core";
import { api, authClient } from "@workspace/ui-clients";
import { useDemoStore } from "@workspace/ui-store";
import { Plus, Trash2, Sun, Moon, PlusCircle, MinusCircle, RotateCcw } from "lucide-react";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

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
  } = useDemoStore();

  const [newTodoText, setNewTodoText] = useState("");

  // Sync theme with DOM
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText("");
    }
  };

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.users.me.$get();
        if (res.ok) {
          const data = await res.json();
          console.log("Successfully fetched profile via RPC:", data.user?.email);
        }
      } catch (err) {
        console.error("Failed to fetch profile via RPC:", err);
      }
    };
    if (session) {
      fetchProfile();
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="flex min-h-[400px] flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  return (
    <div className="rise-in mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="border-line flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {session.user.name}</p>
        </div>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-line col-span-1 border">
          <CardHeader className="border-line flex flex-col items-center border-b pb-6">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {session.user.name
                ?.split(" ")
                ?.map((n: string) => n[0])
                ?.join("")
                ?.toUpperCase() || "U"}
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
                      ? "font-semibold text-green-600"
                      : "font-semibold text-yellow-600"
                  }
                >
                  {session.user.emailVerified ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(session.user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-line col-span-1 border md:col-span-2">
          <CardHeader>
            <CardTitle>Session Data</CardTitle>
            <CardDescription>Raw Better Auth session structure</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="border-line max-h-60 overflow-auto rounded-md border bg-muted p-4 font-mono text-xs">
              {JSON.stringify(session, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      <Card className="border-line overflow-hidden border bg-card shadow-md">
        <CardHeader className="border-line border-b bg-primary/5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Zustand Monorepo Store Demo</CardTitle>
              <CardDescription>
                Demonstrates global, reactive state management via a shared package
              </CardDescription>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="border-line h-10 w-10 rounded-full border"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? (
                <Moon className="text-sea-ink h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-400" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Counter Subsection */}
            <div className="border-line/40 flex flex-col gap-4 rounded-xl border bg-muted/30 p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <span>🔢</span> Counter Store Slice
              </h3>
              <p className="text-sm text-muted-foreground">
                Test reactivity. State changes update instantly across components.
              </p>
              <div className="border-line/30 my-2 flex flex-col items-center justify-center rounded-lg border bg-card p-6">
                <span className="text-5xl font-extrabold tracking-tight text-primary">{count}</span>
                <span className="mt-1 text-xs tracking-wider text-muted-foreground uppercase">
                  Current Count
                </span>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={decrement}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <MinusCircle className="h-4 w-4" /> Decrement
                </Button>
                <Button
                  onClick={increment}
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" /> Increment
                </Button>
                <Button
                  onClick={resetCount}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-destructive hover:bg-destructive/10"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </Button>
              </div>
            </div>

            {/* Todo List Subsection */}
            <div className="border-line/40 flex flex-col gap-4 rounded-xl border bg-muted/30 p-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <span>✅</span> Todo List Store Slice
              </h3>
              <p className="text-sm text-muted-foreground">
                Add, toggle, or delete items. Persisted in volatile memory in Zustand.
              </p>

              <form onSubmit={handleAddTodo} className="flex gap-2">
                <Input
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="Create a new task..."
                  className="flex-1 animate-none"
                />
                <Button type="submit" size="sm" className="h-8">
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </form>

              <div className="flex max-h-[180px] flex-col gap-2 overflow-y-auto pr-1">
                {todos.length === 0 ? (
                  <div className="border-line/30 rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
                    No tasks remaining!
                  </div>
                ) : (
                  todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`flex items-center justify-between rounded-lg border p-2.5 transition-all ${
                        todo.completed
                          ? "border-line/20 bg-muted/40 text-muted-foreground line-through"
                          : "border-line/40 bg-card hover:border-primary/30"
                      }`}
                    >
                      <div
                        onClick={() => toggleTodo(todo.id)}
                        className="flex flex-1 cursor-pointer items-center gap-3 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => {}} // handled by click
                          className="h-4 w-4 cursor-pointer rounded border-input text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium">{todo.text}</span>
                      </div>
                      <Button
                        onClick={() => removeTodo(todo.id)}
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
  );
}
