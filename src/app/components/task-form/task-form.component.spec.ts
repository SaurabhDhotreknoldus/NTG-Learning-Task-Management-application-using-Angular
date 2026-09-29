import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the task form component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial default values', () => {
    expect(component.taskTitle).toBe('');
    expect(component.selectedPriority).toBe('medium');
    expect(component.isSubmitted).toBe(false);
  });

  it('should update priority when setPriority is called', () => {
    component.setPriority('high');
    expect(component.selectedPriority).toBe('high');

    component.setPriority('low');
    expect(component.selectedPriority).toBe('low');
  });

  it('should emit taskAdded event on valid submission', () => {
    const emitSpy = vi.spyOn(component.taskAdded, 'emit');
    component.taskTitle = 'Finish Angular documentation';
    component.selectedPriority = 'high';

    const fakeForm = {
      invalid: false,
      resetForm: vi.fn()
    } as any;

    component.onSubmit(fakeForm);

    expect(emitSpy).toHaveBeenCalledWith({
      title: 'Finish Angular documentation',
      priority: 'high'
    });
    expect(component.taskTitle).toBe('');
    expect(component.selectedPriority).toBe('medium');
  });

  it('should reset form state when resetForm is called', () => {
    component.taskTitle = 'Draft task to be cleared';
    component.selectedPriority = 'high';
    component.isSubmitted = true;

    const fakeForm = {
      resetForm: vi.fn()
    } as any;

    component.resetForm(fakeForm);

    expect(component.taskTitle).toBe('');
    expect(component.selectedPriority).toBe('medium');
    expect(component.isSubmitted).toBe(false);
    expect(fakeForm.resetForm).toHaveBeenCalled();
  });
});
