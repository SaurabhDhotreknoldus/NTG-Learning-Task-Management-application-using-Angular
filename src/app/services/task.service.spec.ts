import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial default tasks', () => {
    expect(service.tasks().length).toBeGreaterThan(0);
    expect(service.totalCount()).toBe(service.tasks().length);
  });

  it('should correctly calculate pending tasks count', () => {
    const pending = service.tasks().filter((t) => !t.completed).length;
    expect(service.pendingCount()).toBe(pending);
  });

  it('should add a new task with given priority', () => {
    const initialCount = service.totalCount();
    service.addTask('New Test Task', 'high');

    expect(service.totalCount()).toBe(initialCount + 1);
    const added = service.tasks()[0];
    expect(added.title).toBe('New Test Task');
    expect(added.priority).toBe('high');
    expect(added.completed).toBe(false);
  });

  it('should not add an empty or whitespace-only task', () => {
    const initialCount = service.totalCount();
    service.addTask('   ', 'low');
    expect(service.totalCount()).toBe(initialCount);
  });

  it('should toggle task completion status', () => {
    const firstTask = service.tasks()[0];
    const initialCompleted = firstTask.completed;

    service.toggleTask(firstTask.id);
    const updatedTask = service.tasks().find((t) => t.id === firstTask.id);
    expect(updatedTask?.completed).toBe(!initialCompleted);
  });

  it('should delete a task by ID', () => {
    const firstTask = service.tasks()[0];
    const initialCount = service.totalCount();

    service.deleteTask(firstTask.id);
    expect(service.totalCount()).toBe(initialCount - 1);
    expect(service.tasks().some((t) => t.id === firstTask.id)).toBe(false);
  });

  it('should clear all tasks', () => {
    service.clearAllTasks();
    expect(service.totalCount()).toBe(0);
    expect(service.pendingCount()).toBe(0);
    expect(service.completedCount()).toBe(0);
  });

  it('should reset to default sample tasks', () => {
    service.clearAllTasks();
    expect(service.totalCount()).toBe(0);

    service.resetToDefaults();
    expect(service.totalCount()).toBe(4);
  });
});
