import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Task, TaskStatus } from '../types';

interface TaskState {
  tasks: Task[];
  view: 'list' | 'kanban';
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'CHANGE_VIEW'; payload: 'list' | 'kanban' }
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; status: TaskStatus } };

const initialState: TaskState = {
  tasks: [],
  view: 'list',
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'CHANGE_VIEW':
      return {
        ...state,
        view: action.payload,
      };
    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? { ...task, status: action.payload.status }
            : task
        ),
      };
    default:
      return state;
  }
};

interface TaskContextType extends TaskState {
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  changeView: (view: 'list' | 'kanban') => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const changeView = (view: 'list' | 'kanban') => {
    dispatch({ type: 'CHANGE_VIEW', payload: view });
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, status } });
  };

  return (
    <TaskContext.Provider
      value={{
        ...state,
        addTask,
        updateTask,
        deleteTask,
        changeView,
        updateTaskStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}; 