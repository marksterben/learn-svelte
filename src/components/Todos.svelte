<!-- components/Todos.svelte -->
<script>
  import { onMount } from "svelte";

  import FilterButton from "./FilterButton.svelte";
  import Todo from "./Todo.svelte";
  import MoreActions from "./MoreActions.svelte";
  import NewTodo from "./NewTodo.svelte";
  import TodosStatus from "./TodosStatus.svelte";

  import { alert, todos } from "../stores.js";
  import {
    addTodoService,
    checkAllTodosService,
    deleteCompletedTodosService,
    deleteTodoService,
    getTodosService,
    updateTodoService,
  } from "../services/todo";

  let todosStatus; // reference to TodosStatus instance
  let isLoading = false;

  async function addTodo(name) {
    const res = await addTodoService(name);
    if (res) {
      await fetchTodos();
      $alert = `Todo '${name}' has been added`;
    } else {
      $alert = "Failed to add new todo";
    }
  }

  async function removeTodo(todo) {
    const res = await deleteTodoService(todo);
    if (res) {
      await fetchTodos();
      todosStatus.focus(); // give focus to status heading
      $alert = `Todo '${todo.name}' has been deleted`;
    } else {
      $alert = "Failed to delete todo";
    }
  }

  async function updateTodo(todo) {
    const res = await updateTodoService(todo);
    if (res) {
      const i = $todos.findIndex((t) => t.id === todo.id);
      if ($todos[i].name !== todo.name)
        $alert = `todo '${$todos[i].name}' has been renamed to '${todo.name}'`;
      if ($todos[i].completed !== todo.completed)
        $alert = `todo '${$todos[i].name}' marked as ${
          todo.completed ? "completed" : "active"
        }`;
      await fetchTodos();
    } else {
      $alert = "Failed to update todo";
    }
  }

  let filter = "all";
  const filterTodos = (filter, todos) =>
    filter === "active"
      ? todos.filter((t) => !t.completed)
      : filter === "completed"
      ? todos.filter((t) => t.completed)
      : todos;

  $: {
    if (filter === "all") $alert = "Browsing all todos";
    else if (filter === "active") $alert = "Browsing active todos";
    else if (filter === "completed") $alert = "Browsing completed todos";
  }

  const checkAllTodos = async (completed) => {
    const res = await checkAllTodosService(completed);
    await fetchTodos();
    $alert = `${completed ? "Checked" : "Unchecked"} ${
      res ? res.count : "0"
    } todos`;
  };
  const removeCompletedTodos = async () => {
    const res = await deleteCompletedTodosService();
    await fetchTodos();
    $alert = `Removed ${res ? res.count : "0"} todos`;
  };

  const fetchTodos = async () => {
    const res = await getTodosService();
    if (res) {
      $todos = res.data;
    }
  };

  onMount(async () => {
    isLoading = true;
    await fetchTodos();
    isLoading = false;
  });
</script>

<div class="todoapp stack-large">
  <!-- NewTodo -->
  <NewTodo autofocus on:addTodo={(e) => addTodo(e.detail)} />

  <!-- Filter -->
  <FilterButton bind:filter />

  <!-- TodosStatus -->
  <TodosStatus bind:this={todosStatus} />

  <!-- Todos -->
  <ul role="list" class="todo-list stack-large" aria-labelledby="list-heading">
    {#if isLoading}
      <li>Loading ....</li>
    {:else}
      {#each filterTodos(filter, $todos) as todo (todo.id)}
        <li class="todo">
          <Todo
            {todo}
            on:update={(e) => updateTodo(e.detail)}
            on:remove={(e) => removeTodo(e.detail)}
          />
        </li>
      {:else}
        <li>Nothing to do here!</li>
      {/each}
    {/if}
  </ul>

  <hr />

  <!-- MoreActions -->
  <MoreActions
    on:checkAll={(e) => checkAllTodos(e.detail)}
    on:removeCompleted={removeCompletedTodos}
  />
</div>
