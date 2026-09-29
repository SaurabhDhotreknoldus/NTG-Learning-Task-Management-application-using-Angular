import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskPriority } from '../../models/task.model';

interface PriorityOption {
  value: TaskPriority;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  @Output() taskAdded = new EventEmitter<{ title: string; priority: TaskPriority }>();

  // Two-way bound fields
  taskTitle: string = '';
  selectedPriority: TaskPriority = 'medium';

  // State
  isSubmitted: boolean = false;

  readonly priorityOptions: PriorityOption[] = [
    {
      value: 'low',
      label: 'Low',
      icon: '🟢',
      description: 'Minor or deferred items'
    },
    {
      value: 'medium',
      label: 'Medium',
      icon: '🟡',
      description: 'Normal everyday tasks'
    },
    {
      value: 'high',
      label: 'High',
      icon: '🔴',
      description: 'Urgent & high priority'
    }
  ];

  /**
   * Set selected priority option
   */
  setPriority(priority: TaskPriority): void {
    this.selectedPriority = priority;
  }

  /**
   * Handle form submission
   */
  onSubmit(form: NgForm): void {
    this.isSubmitted = true;

    if (form.invalid || !this.taskTitle.trim()) {
      return;
    }

    this.taskAdded.emit({
      title: this.taskTitle.trim(),
      priority: this.selectedPriority
    });

    this.resetForm(form);
  }

  /**
   * Reset form and component state
   */
  resetForm(form?: NgForm): void {
    this.taskTitle = '';
    this.selectedPriority = 'medium';
    this.isSubmitted = false;

    if (form) {
      form.resetForm({
        selectedPriority: 'medium'
      });
      this.selectedPriority = 'medium';
    }
  }

  /**
   * Dynamic CSS class for priority selection button
   */
  getPriorityCardClass(priorityValue: TaskPriority): Record<string, boolean> {
    return {
      'priority-card--selected': this.selectedPriority === priorityValue,
      [`priority-card--${priorityValue}`]: true
    };
  }
}
