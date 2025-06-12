import { createContext, useContext, useReducer, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Task, TaskStatus } from '../types';

interface TaskState {
  tasks: Task[];
  view: 'list' | 'kanban';
  activeFilter: 'all' | 'inbox' | 'today' | 'priority';
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; status: TaskStatus } }
  | { type: 'TOGGLE_VIEW' }
  | { type: 'SET_FILTER'; payload: TaskState['activeFilter'] }
  | { type: 'LOAD_STATE'; payload: TaskState };

const STORAGE_KEY = 'todo_app_state';

// Helper function to safely parse dates from localStorage
const parseDates = (tasks: Task[]): Task[] => {
  return tasks.map(task => ({
    ...task,
    createdAt: new Date(task.createdAt),
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined
  }));
};

// Load initial state from localStorage or use default
const loadInitialState = (): TaskState => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    const parsed = JSON.parse(savedState);
    return {
      ...parsed,
      tasks: parseDates(parsed.tasks),
      activeFilter: parsed.activeFilter || 'inbox'
    };
  }
  return {
    tasks: [],
    view: 'list',
    activeFilter: 'inbox'
  };
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  let newState: TaskState;
  
  switch (action.type) {
    case 'ADD_TASK':
      newState = {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
      break;
    case 'UPDATE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
      break;
    case 'DELETE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
      break;
    case 'UPDATE_TASK_STATUS':
      newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? { ...task, status: action.payload.status }
            : task
        ),
      };
      break;
    case 'TOGGLE_VIEW':
      newState = {
        ...state,
        view: state.view === 'list' ? 'kanban' : 'list',
      };
      break;
    case 'SET_FILTER':
      newState = {
        ...state,
        activeFilter: action.payload,
      };
      break;
    case 'LOAD_STATE':
      newState = action.payload;
      break;
    default:
      return state;
  }

  // Save to localStorage after each action
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  return newState;
};

interface TaskContextType extends TaskState {
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  toggleView: () => void;
  setFilter: (filter: TaskState['activeFilter']) => void;
  filteredTasks: Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, loadInitialState());

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

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, status } });
  };

  const toggleView = () => {
    dispatch({ type: 'TOGGLE_VIEW' });
  };

  const setFilter = (filter: TaskState['activeFilter']) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const filteredTasks = useMemo(() => {
    switch (state.activeFilter) {
      case 'inbox': {
        // Sort by due date first, then by creation date
        return [...state.tasks].sort((a, b) => {
          if (a.dueDate && b.dueDate) {
            return a.dueDate.getTime() - b.dueDate.getTime();
          }
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
      }
      case 'today': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return state.tasks.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        });
      }
      case 'priority': {
        const priorityOrder = { P1: 0, P2: 1, P3: 2, P4: 3 };
        return [...state.tasks].sort((a, b) => {
          // First sort by priority
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDiff !== 0) return priorityDiff;
          
          // Then by due date if available
          if (a.dueDate && b.dueDate) {
            return a.dueDate.getTime() - b.dueDate.getTime();
          }
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;
          
          // Finally by creation date
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
      }
      default:
        return state.tasks;
    }
  }, [state.tasks, state.activeFilter]);

  return (
    <TaskContext.Provider
      value={{
        ...state,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        toggleView,
        setFilter,
        filteredTasks,
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