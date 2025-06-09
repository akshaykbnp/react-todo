export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: Date;
  dueDate?: Date;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
} 