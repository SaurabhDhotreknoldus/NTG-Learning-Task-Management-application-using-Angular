import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TaskService } from './services/task.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let taskService: TaskService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [TaskService]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the app root component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the brand title in header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-name')?.textContent).toContain('TaskMaster');
  });

  it('should display the live pending tasks count in header badge and metrics card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const pendingText = compiled.querySelector('.live-status-pill')?.textContent;
    expect(pendingText).toContain(String(component.pendingCount()));
  });

  it('should render task form and task list subcomponents', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-task-form')).toBeTruthy();
    expect(compiled.querySelector('app-task-list')).toBeTruthy();
  });

  it('should add task through service when onTaskAdded is called', () => {
    const initialCount = component.totalCount();
    component.onTaskAdded({ title: 'New Angular Task', priority: 'high' });
    expect(component.totalCount()).toBe(initialCount + 1);
  });
});
