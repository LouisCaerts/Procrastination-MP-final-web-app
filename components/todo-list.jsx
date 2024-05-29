"use client";

import { useState, useEffect } from 'react'
import { useSession, useAuth } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import styles from '../styles/globals.css';

const supabaseClient = async (supabaseAccessToken) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
  })

  return supabase
}

export function TodoListCombo() {
    const [todos, setTodos] = useState(null)

    return (
        <div>
            <AddTodoForm todos={todos} setTodos={setTodos} />
            <TodoList todos={todos} setTodos={setTodos} />
        </div>
    );
}

export function TodoList({ todos, setTodos }) {
    const { session, isLoaded } = useSession()
    const [loading, setLoading] = useState(true)

    // on first load, fetch and set todos
    useEffect(() => {
        const loadTodos = async () => {
              try {
                setLoading(true);
                if (isLoaded) {
                    const supabaseAccessToken = await session.getToken({
                        template: 'supabase',
                    });
                    const supabase = await supabaseClient(supabaseAccessToken);
                    const { data: todos } = await supabase.from('todos').select('*');
                    setTodos(todos);
                }
            } catch (e) {
                console.log('Exception while fetching todos:', e);
            } finally {
                setLoading(false);
            }
        }
        loadTodos()
    }, [isLoaded, session, setTodos]);

    // if loading, just show basic message
    if (loading) {
        return <div className={styles.container}>Loading...</div>
    }

    // display all the todos
    return (
        <>
        {isLoaded ? (
          <>
        {todos?.length > 0 ? (
            <div className={styles.todoList}>
            <ol>
                {todos.map((todo) => (
                <li key={todo.id}>{todo.title}</li>
                ))}
            </ol>
            </div>
        ) : (
            <div className={styles.label}>{"You don't have any todos!"}</div>
        )}
        </>
    ) : (
        <div>Loading...</div>
      )}
    </>
    );
}

export function AddTodoForm({ todos, setTodos }) {
    const { getToken, userId } = useAuth()
    const [newTodo, setNewTodo] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newTodo === '') {
          return
        }

        const supabaseAccessToken = await getToken({
          template: 'supabase',
        })
        const supabase = await supabaseClient(supabaseAccessToken)
        const { data } = await supabase.from('todos').insert({ title: newTodo, user_id: userId }).select()
    
        setTodos([...todos, data[0]])
        setNewTodo('')
    }

    return (
      <form onSubmit={handleSubmit}>
        <input onChange={(e) => setNewTodo(e.target.value)} value={newTodo} />
        &nbsp;<button>Add Todo</button>
      </form>
    );
}