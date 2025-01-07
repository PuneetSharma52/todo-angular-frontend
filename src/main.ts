import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  editing?: boolean;
  archived?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="theme-toggle">
        <button (click)="toggleTheme()">
          {{ isDarkMode ? '☀️ Light' : '🌙 Dark' }}
        </button>
      </div>

      <h1>Todo List</h1>

      <div class="add-todo">
        <input
          type="text"
          [(ngModel)]="newTodoTitle"
          (keyup.enter)="addTodo()"
          placeholder="Add new task..."
        >
        <button (click)="addTodo()">Add</button>
      </div>

      <div class="filters">
        <button
          *ngFor="let filter of filters"
          (click)="currentFilter = filter"
          [class.active]="currentFilter === filter"
        >
          {{ filter }}
        </button>
      </div>

      <div class="todos">
        <div *ngFor="let todo of filteredTodos" class="todo-item">
          <div class="todo-content">
            <input
              type="checkbox"
              [checked]="todo.completed"
              (change)="toggleTodo(todo)"
            >
            <span
              *ngIf="!todo.editing"
              [class.completed]="todo.completed"
              (dblclick)="startEditing(todo)"
            >
              {{ todo.title }}
            </span>
            <input
              *ngIf="todo.editing"
              type="text"
              [(ngModel)]="todo.title"
              (blur)="finishEditing(todo)"
              (keyup.enter)="finishEditing(todo)"
              class="edit-input"
            >
          </div>
          <div class="todo-actions">
            <button (click)="toggleArchive(todo)">
              {{ todo.archived ? '📤' : '📥' }}
            </button>
            <button (click)="deleteTodo(todo)">×</button>
          </div>
        </div>
      </div>

      <div class="features-section">
        <h2>Features:</h2>
        <div class="feature" *ngFor="let feature of features">
          {{ feature }}
        </div>
      </div>

      <div class="footer">
        © 2024 Harish Jangra
      </div>
    </div>
  `
})
export class App implements OnInit {
  todos: Todo[] = [];
  newTodoTitle = '';
  filters = ['All', 'Active', 'Completed'];
  currentFilter = 'All';
  isDarkMode = false;
  showArchived = false;

  get filteredTodos() {
    if (this.currentFilter === 'Active') {
      return this.todos.filter(todo => !todo.completed && !todo.archived);
    } else if (this.currentFilter === 'Completed') {
      return this.todos.filter(todo => todo.completed && !todo.archived);
    } else {
      return this.todos.filter(todo => !todo.archived);
    }
  }

  features = [
    'Archive tasks to declutter your list.',
    'Dark/Light theme toggle for better visibility.',
    'Filter tasks based on completion status.',
    'Editable tasks by double-clicking.',
    'Save your progress with local storage.'
  ];

  ngOnInit() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) this.todos = JSON.parse(savedTodos);

    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme) {
      this.isDarkMode = JSON.parse(savedTheme);
      if (this.isDarkMode) document.body.classList.add('dark-mode');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  addTodo() {
    if (this.newTodoTitle.trim()) {
      this.todos.unshift({
        id: Date.now(),
        title: this.newTodoTitle.trim(),
        completed: false,
        archived: false
      });
      this.newTodoTitle = '';
      this.saveTodos();
    }
  }

  toggleTodo(todo: Todo) {
    todo.completed = !todo.completed;
    this.saveTodos();
  }

  toggleArchive(todo: Todo) {
    todo.archived = !todo.archived;
    this.saveTodos();
  }

  deleteTodo(todo: Todo) {
    this.todos = this.todos.filter(t => t.id !== todo.id);
    this.saveTodos();
  }

  startEditing(todo: Todo) {
    todo.editing = true;
  }

  finishEditing(todo: Todo) {
    todo.editing = false;
    if (!todo.title.trim()) this.deleteTodo(todo);
    this.saveTodos();
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}

bootstrapApplication(App);
