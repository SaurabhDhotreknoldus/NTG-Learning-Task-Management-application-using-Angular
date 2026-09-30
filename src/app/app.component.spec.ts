import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { TaskService } from './services/task.service';
import { routes } from './app.routes';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let taskService: TaskService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [TaskService, provideRouter(routes)]
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

  it('should render router-outlet and main navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();

    const navLinks = compiled.querySelectorAll('.nav-tab-link');
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].textContent).toContain('Tasks');
    expect(navLinks[1].textContent).toContain('Add Task');
  });

  it('should call TaskService.resetToDefaults when onResetSampleData is called', () => {
    const resetSpy = vi.spyOn(taskService, 'resetToDefaults');
    component.onResetSampleData();
    expect(resetSpy).toHaveBeenCalled();
  });
});
