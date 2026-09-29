import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TaskListComponent } from './task-list.component';
import { Task } from '../../models/task.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

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
    await TestBed.configureTestingModule({
      imports: [TaskListComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    component.tasks = [...mockTasks];
    component.pendingCount = 2;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the task list component', () => {
    expect(component).toBeTruthy();
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

  it('should emit taskToggled event when onToggleTask is called', () => {
    const spy = vi.spyOn(component.taskToggled, 'emit');
    component.onToggleTask('task-2');
    expect(spy).toHaveBeenCalledWith('task-2');
  });

  it('should emit taskDeleted event when onDeleteTask is called', () => {
    const spy = vi.spyOn(component.taskDeleted, 'emit');
    component.onDeleteTask('task-3');
    expect(spy).toHaveBeenCalledWith('task-3');
  });

  it('should return correct dynamic class mapping for task card', () => {
    const classes = component.getTaskCardClass(mockTasks[0]);
    expect(classes['task-item']).toBe(true);
    expect(classes['task-item--completed']).toBe(true);
    expect(classes['priority-high']).toBe(true);
  });
});
