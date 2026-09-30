import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
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
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  // Dependency Injection via inject()
  private readonly fb = inject(FormBuilder);
  readonly taskService = inject(TaskService);
  readonly router = inject(Router);

  // Optional output retained for component composability
  @Output() taskAdded = new EventEmitter<{ title: string; priority: TaskPriority; completed: boolean }>();

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

  // Reactive Form Definition with validations
  readonly taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    priority: ['medium' as TaskPriority, [Validators.required]],
    completed: [false] // Assignment 2 requirement: Allow setting completed status
  });

  get titleControl() {
    return this.taskForm.get('title');
  }

  get priorityControl() {
    return this.taskForm.get('priority');
  }

  get completedControl() {
    return this.taskForm.get('completed');
  }

  get selectedPriority(): TaskPriority {
    return this.priorityControl?.value || 'medium';
  }

  get titleLength(): number {
    return this.titleControl?.value?.length || 0;
  }

  setPriority(priority: TaskPriority): void {
    this.priorityControl?.setValue(priority);
    this.priorityControl?.markAsDirty();
  }

  clearTitle(): void {
    this.titleControl?.setValue('');
    this.titleControl?.markAsUntouched();
  }

  /**
   * Reset form fields to clean default state
   */
  resetForm(): void {
    this.isSubmitted = false;
    this.taskForm.reset({
      title: '',
      priority: 'medium',
      completed: false
    });
  }

  /**
   * Submit task form, add task via TaskService DI, and navigate back to /tasks
   */
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const { title, priority, completed } = this.taskForm.getRawValue();
    const trimmedTitle = (title || '').trim();

    if (!trimmedTitle) {
      return;
    }

    // Add task through injected TaskService
    this.taskService.addTask(trimmedTitle, priority, !!completed);

    // Emit event (for composability/listeners)
    this.taskAdded.emit({
      title: trimmedTitle,
      priority,
      completed: !!completed
    });

    // Reset form after successfully adding
    this.resetForm();

    // Assignment 2 requirement: Navigate back to the Task List view
    this.router.navigate(['/tasks']);
  }

  getPriorityCardClass(priorityValue: TaskPriority): Record<string, boolean> {
    return {
      'priority-card--selected': this.selectedPriority === priorityValue,
      [`priority-card--${priorityValue}`]: true
    };
  }
}
