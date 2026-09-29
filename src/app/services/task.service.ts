import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskPriority } from '../models/task.model';

const STORAGE_KEY = 'ntg_task_manager_tasks';

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Review pull requests for Angular 22 migration',
    priority: 'high',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 3)
  },
  {
    id: 'task-2',
    title: 'Design high-fidelity UI components in SCSS',
    priority: 'medium',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 5)
  },
  {
    id: 'task-3',
    title: 'Implement dynamic priority badges and animations',
    priority: 'low',
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 8)
  },
  {
    id: 'task-4',
    title: 'Setup repository structure and Angular CLI project',
    priority: 'high',
    completed: true,
    createdAt: new Date(Date.now() - 3600000 * 24)
  }
];

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly tasksSignal = signal<Task[]>(this.loadInitialTasks());

  /** Read-only access to tasks */
  readonly tasks = this.tasksSignal.asReadonly();

  /** Live count of pending tasks */
  readonly pendingCount = computed(() =>
    this.tasksSignal().filter((task) => !task.completed).length
  );

  /** Live count of completed tasks */
  readonly completedCount = computed(() =>
    this.tasksSignal().filter((task) => task.completed).length
  );

  /** Live count of total tasks */
  readonly totalCount = computed(() => this.tasksSignal().length);

  /** Completion percentage (0 - 100) */
  readonly completionRate = computed(() => {
    const total = this.totalCount();
    return total === 0 ? 0 : Math.round((this.completedCount() / total) * 100);
  });

  private loadInitialTasks(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt)
          }));
        }
      }
    } catch (e) {
      console.warn('Could not load tasks from localStorage', e);
    }
    return DEFAULT_TASKS;
  }

  private saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Could not save tasks to localStorage', e);
    }
  }

  /**
   * Adds a new task to the beginning of the list.
   */
  addTask(title: string, priority: TaskPriority): void {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTask: Task = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: trimmedTitle,
      priority,
      completed: false,
      createdAt: new Date()
    };

    this.tasksSignal.update((current) => {
      const updated = [newTask, ...current];
      this.saveTasks(updated);
      return updated;
    });
  }

  /**
   * Toggles completion status of a task.
   */
  toggleTask(id: string): void {
    this.tasksSignal.update((current) => {
      const updated = current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      this.saveTasks(updated);
      return updated;
    });
  }

  /**
   * Deletes a task by ID.
   */
  deleteTask(id: string): void {
    this.tasksSignal.update((current) => {
      const updated = current.filter((task) => task.id !== id);
      this.saveTasks(updated);
      return updated;
    });
  }

  /**
   * Clears all tasks.
   */
  clearAllTasks(): void {
    this.tasksSignal.set([]);
    this.saveTasks([]);
  }

  /**
   * Resets list to default sample tasks.
   */
  resetToDefaults(): void {
    this.tasksSignal.set(DEFAULT_TASKS);
    this.saveTasks(DEFAULT_TASKS);
  }
}
