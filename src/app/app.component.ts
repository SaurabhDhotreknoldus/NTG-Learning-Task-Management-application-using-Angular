import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './services/task.service';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskPriority } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly title = 'TaskMaster - NTG Task Management';
  readonly appVersion = 'v1.0.0';

  // Inject TaskService (Signals-driven architecture)
  readonly taskService = inject(TaskService);

  // Expose signals for high-level dashboard and metrics
  readonly tasks = this.taskService.tasks;
  readonly pendingCount = this.taskService.pendingCount;
  readonly completedCount = this.taskService.completedCount;
  readonly totalCount = this.taskService.totalCount;
  readonly completionRate = this.taskService.completionRate;

  /**
   * Handle task added event from TaskFormComponent
   */
  onTaskAdded(event: { title: string; priority: TaskPriority }): void {
    this.taskService.addTask(event.title, event.priority);
  }

  /**
   * Handle task status toggle
   */
  onTaskToggled(id: string): void {
    this.taskService.toggleTask(id);
  }

  /**
   * Handle task deletion
   */
  onTaskDeleted(id: string): void {
    this.taskService.deleteTask(id);
  }

  /**
   * Handle clearing all tasks
   */
  onAllTasksCleared(): void {
    this.taskService.clearAllTasks();
  }

  /**
   * Reset sample data for easy demonstration and evaluator testing
   */
  onResetSampleData(): void {
    this.taskService.resetToDefaults();
  }
}
