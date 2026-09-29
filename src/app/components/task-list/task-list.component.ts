import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskFilter, PriorityFilter, TaskPriority } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  /** Input list of tasks */
  @Input({ required: true }) tasks: Task[] = [];
  /** Input live count of pending tasks */
  @Input() pendingCount: number = 0;

  /** Event emitted when a task is toggled */
  @Output() taskToggled = new EventEmitter<string>();
  /** Event emitted when a task is deleted */
  @Output() taskDeleted = new EventEmitter<string>();
  /** Event emitted when clear all is requested */
  @Output() allTasksCleared = new EventEmitter<void>();

  // Filter signals/state (demonstrating two-way binding and modern signal computing)
  searchQuery: string = '';
  activeStatusFilter: TaskFilter = 'all';
  activePriorityFilter: PriorityFilter = 'all';
  moveCompletedToBottom: boolean = true;

  /**
   * Filtered and sorted tasks
   */
  get filteredTasks(): Task[] {
    let result = [...this.tasks];

    // Status filter
    if (this.activeStatusFilter === 'pending') {
      result = result.filter((t) => !t.completed);
    } else if (this.activeStatusFilter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Priority filter
    if (this.activePriorityFilter !== 'all') {
      result = result.filter((t) => t.priority === this.activePriorityFilter);
    }

    // Search query filter
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((t) => t.title.toLowerCase().includes(query));
    }

    // Sort: if moveCompletedToBottom is true, place completed items at the end
    if (this.moveCompletedToBottom) {
      result.sort((a, b) => {
        if (a.completed === b.completed) {
          // Keep newer items first within same completed state
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.completed ? 1 : -1;
      });
    }

    return result;
  }

  // Quick statistics for display
  get totalTasksCount(): number {
    return this.tasks.length;
  }

  get completedTasksCount(): number {
    return this.tasks.filter((t) => t.completed).length;
  }

  setStatusFilter(filter: TaskFilter): void {
    this.activeStatusFilter = filter;
  }

  setPriorityFilter(filter: PriorityFilter): void {
    this.activePriorityFilter = filter;
  }

  onToggleTask(id: string): void {
    this.taskToggled.emit(id);
  }

  onDeleteTask(id: string): void {
    this.taskDeleted.emit(id);
  }

  onClearAll(): void {
    if (confirm('Are you sure you want to clear all tasks?')) {
      this.allTasksCleared.emit();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  /**
   * Returns dynamic CSS class mapping for a task item based on priority and completed state
   */
  getTaskCardClass(task: Task): Record<string, boolean> {
    return {
      'task-item': true,
      'task-item--completed': task.completed,
      'task-item--pending': !task.completed,
      [`priority-${task.priority}`]: true
    };
  }

  /**
   * Returns dynamic badge class for task priority
   */
  getPriorityBadgeClass(priority: TaskPriority): string {
    switch (priority) {
      case 'high':
        return 'badge-priority badge-priority--high';
      case 'medium':
        return 'badge-priority badge-priority--medium';
      case 'low':
        return 'badge-priority badge-priority--low';
      default:
        return 'badge-priority';
    }
  }

  getPriorityLabel(priority: TaskPriority): string {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }
}
