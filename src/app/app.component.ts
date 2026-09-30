import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly title = 'TaskMaster - NTG Task Management';
  readonly appVersion = 'v2.0.0 (Architecture & Ecosystem)';

  // Inject TaskService via Angular Dependency Injection
  readonly taskService = inject(TaskService);

  // Expose signals for live metrics dashboard
  readonly tasks = this.taskService.tasks;
  readonly pendingCount = this.taskService.pendingCount;
  readonly completedCount = this.taskService.completedCount;
  readonly totalCount = this.taskService.totalCount;
  readonly completionRate = this.taskService.completionRate;

  /**
   * Reset sample data for easy demonstration and evaluator testing
   */
  onResetSampleData(): void {
    this.taskService.resetToDefaults();
  }
}
