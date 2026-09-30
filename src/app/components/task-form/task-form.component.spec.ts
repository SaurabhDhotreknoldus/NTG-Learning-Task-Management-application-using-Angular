import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../services/task.service';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskService: TaskService;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, ReactiveFormsModule],
      providers: [TaskService, provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the task form component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize reactive form with default controls and values', () => {
    expect(component.taskForm).toBeDefined();
    expect(component.titleControl?.value).toBe('');
    expect(component.priorityControl?.value).toBe('medium');
    expect(component.completedControl?.value).toBe(false);
    expect(component.taskForm.invalid).toBe(true);
  });

  it('should validate title as required and minlength of 3', () => {
    component.titleControl?.setValue('');
    expect(component.titleControl?.errors?.['required']).toBeTruthy();

    component.titleControl?.setValue('Ab');
    expect(component.titleControl?.errors?.['minlength']).toBeTruthy();

    component.titleControl?.setValue('Valid Task Title');
    expect(component.titleControl?.errors).toBeNull();
  });

  it('should update priority when setPriority is called', () => {
    component.setPriority('high');
    expect(component.selectedPriority).toBe('high');
    expect(component.priorityControl?.value).toBe('high');

    component.setPriority('low');
    expect(component.selectedPriority).toBe('low');
    expect(component.priorityControl?.value).toBe('low');
  });

  it('should toggle completed control value', () => {
    component.completedControl?.setValue(true);
    expect(component.completedControl?.value).toBe(true);
  });

  it('should reset form state when resetForm is called', () => {
    component.taskForm.patchValue({
      title: 'Draft task to be cleared',
      priority: 'high',
      completed: true
    });
    component.isSubmitted = true;

    component.resetForm();

    expect(component.titleControl?.value).toBe('');
    expect(component.priorityControl?.value).toBe('medium');
    expect(component.completedControl?.value).toBe(false);
    expect(component.isSubmitted).toBe(false);
  });

  it('should call TaskService.addTask and navigate to /tasks on valid submit', () => {
    const addSpy = vi.spyOn(taskService, 'addTask');
    const navSpy = vi.spyOn(router, 'navigate');

    component.taskForm.patchValue({
      title: 'Ship Assignment 2 architecture',
      priority: 'high',
      completed: false
    });

    component.onSubmit();

    expect(addSpy).toHaveBeenCalledWith('Ship Assignment 2 architecture', 'high', false);
    expect(navSpy).toHaveBeenCalledWith(['/tasks']);
    expect(component.titleControl?.value).toBe('');
  });

  it('should not submit or navigate if form is invalid', () => {
    const addSpy = vi.spyOn(taskService, 'addTask');
    const navSpy = vi.spyOn(router, 'navigate');

    component.titleControl?.setValue('');
    component.onSubmit();

    expect(addSpy).not.toHaveBeenCalled();
    expect(navSpy).not.toHaveBeenCalled();
    expect(component.isSubmitted).toBe(true);
  });
});
