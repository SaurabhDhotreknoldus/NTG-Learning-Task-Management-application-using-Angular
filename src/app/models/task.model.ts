export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: Date;
}

export type TaskFilter = 'all' | 'pending' | 'completed';
export type PriorityFilter = 'all' | TaskPriority;
