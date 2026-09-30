import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: TaskService;

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Setup Angular environment',
      priority: 'high',
      completed: true,
      createdAt: new Date('2026-09-29T10:00:00Z')
    },
    {
      id: 'task-2',
      title: 'Build task list component',
      priority: 'medium',
      completed: false,
      createdAt: new Date('2026-09-29T11:00:00Z')
    },
    {
      id: 'task-3',
      title: 'Style priority badges',
      priority: 'low',
      completed: false,
      createdAt: new Date('2026-09-29T12:00:00Z')
    }
  ];

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TaskListComponent, FormsModule],
      providers: [TaskService, provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    component.tasksInput = [...mockTasks];
    component.pendingCountInput = 2;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the task list component with injected TaskService', () => {
    expect(component).toBeTruthy();
    expect(component.taskService).toBeDefined();
  });

  it('should compute totalTasksCount and completedTasksCount correctly', () => {
    expect(component.totalTasksCount).toBe(3);
    expect(component.completedTasksCount).toBe(1);
  });

  it('should filter tasks by pending status', () => {
    component.setStatusFilter('pending');
    expect(component.filteredTasks.length).toBe(2);
    expect(component.filteredTasks.every((t) => !t.completed)).toBe(true);
  });

  it('should filter tasks by completed status', () => {
    component.setStatusFilter('completed');
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].completed).toBe(true);
  });

  it('should filter tasks by priority', () => {
    component.setPriorityFilter('high');
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].priority).toBe('high');
  });

  it('should filter tasks by search query', () => {
    component.searchQuery = 'priority';
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].title).toBe('Style priority badges');
  });

  it('should move completed tasks to the bottom when moveCompletedToBottom is true', () => {
    component.moveCompletedToBottom = true;
    const filtered = component.filteredTasks;
    const lastItem = filtered[filtered.length - 1];
    expect(lastItem.completed).toBe(true);
  });

  it('should toggle task via TaskService when onToggleTask is called', () => {
    const serviceSpy = vi.spyOn(taskService, 'toggleTask');
    const emitSpy = vi.spyOn(component.taskToggled, 'emit');

    component.onToggleTask('task-2');

    expect(serviceSpy).toHaveBeenCalledWith('task-2');
    expect(emitSpy).toHaveBeenCalledWith('task-2');
  });

  it('should delete task via TaskService when onDeleteTask is called', () => {
    const serviceSpy = vi.spyOn(taskService, 'deleteTask');
    const emitSpy = vi.spyOn(component.taskDeleted, 'emit');

    component.onDeleteTask('task-3');

    expect(serviceSpy).toHaveBeenCalledWith('task-3');
    expect(emitSpy).toHaveBeenCalledWith('task-3');
  });

  it('should return correct dynamic class mapping for task card', () => {
    const classes = component.getTaskCardClass(mockTasks[0]);
    expect(classes['task-item']).toBe(true);
    expect(classes['task-item--completed']).toBe(true);
    expect(classes['priority-high']).toBe(true);
  });

  it('should render routerLink to /add-task in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const addBtn = compiled.querySelector('.add-task-route-btn');
    expect(addBtn).toBeTruthy();
    expect(addBtn?.getAttribute('href') || addBtn?.getAttribute('routerLink')).toBeDefined();
  });
});
