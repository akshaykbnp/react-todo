import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  CalendarIcon, 
  FlagIcon,
  ViewListIcon,
  ViewBoardsIcon,
  PencilIcon,
  XIcon
} from '@heroicons/react/outline';
import { useTaskContext } from '../context/TaskContext';
import type { Task } from '../types';
import AddTaskModal from './AddTaskModal';

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const EditTaskModal = ({ task, isOpen, onClose }: EditTaskModalProps) => {
  const { updateTask, deleteTask } = useTaskContext();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : ''
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask({
      ...task,
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  const getPriorityColor = (p: Task['priority']) => {
    switch (p) {
      case 'P1':
        return 'text-red-600';
      case 'P2':
        return 'text-orange-500';
      case 'P3':
        return 'text-yellow-500';
      case 'P4':
        return 'text-blue-500';
      default:
        return 'text-gray-400';
    }
  };

  const getPriorityLabel = (p: Task['priority']) => {
    switch (p) {
      case 'P1':
        return 'Priority 1';
      case 'P2':
        return 'Priority 2';
      case 'P3':
        return 'Priority 3';
      case 'P4':
        return 'Priority 4';
      default:
        return 'Priority 4';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Edit task</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task name"
                  className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 border-0 border-b-2 border-gray-200 focus:border-[#db4c3f] focus:ring-0 transition-colors"
                  required
                />
              </div>

              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full px-3 py-2 text-gray-900 placeholder-gray-400 border rounded-md border-gray-200 focus:border-[#db4c3f] focus:ring-1 focus:ring-[#db4c3f] transition-colors resize-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <CalendarIcon className="w-5 h-5" />
                    <span>
                      {dueDate ? format(new Date(dueDate), 'MMM d, yyyy') : 'Due date'}
                    </span>
                  </button>
                  {showDatePicker && (
                    <div className="absolute mt-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => {
                          setDueDate(e.target.value);
                          setShowDatePicker(false);
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:border-[#db4c3f] focus:ring-1 focus:ring-[#db4c3f]"
                      />
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 rounded-md transition-colors ${getPriorityColor(priority)}`}
                  >
                    <FlagIcon className="w-5 h-5" />
                    <span>P{priority[1]}</span>
                  </button>
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden group-hover:block">
                    {(['P1', 'P2', 'P3', 'P4'] as Task['priority'][]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                          priority === p ? 'bg-gray-50' : ''
                        } ${getPriorityColor(p)}`}
                      >
                        <FlagIcon className="w-4 h-4" />
                        <span>{getPriorityLabel(p)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                >
                  Delete
                </button>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#db4c3f] hover:bg-[#c53727] text-white rounded-md transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskList = () => {
  const { tasks, toggleView, view, updateTaskStatus } = useTaskContext();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { P1: 0, P2: 1, P3: 2, P4: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by due date
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      // Finally by creation date
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [tasks]);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'P1':
        return 'text-red-600';
      case 'P2':
        return 'text-orange-500';
      case 'P3':
        return 'text-yellow-500';
      case 'P4':
        return 'text-blue-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Today</h1>
          <p className="text-sm text-gray-500 mt-1">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleView}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            {view === 'list' ? (
              <>
                <ViewBoardsIcon className="w-5 h-5" />
                <span>Board View</span>
              </>
            ) : (
              <>
                <ViewListIcon className="w-5 h-5" />
                <span>List View</span>
              </>
            )}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#db4c3f] hover:bg-[#c53727] text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Task
          </button>
        </div>
      </div>
      
      <div className="space-y-1">
        {sortedTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-md transition-colors"
          >
            <button 
              onClick={() => updateTaskStatus(task.id, task.status === 'DONE' ? 'TODO' : 'DONE')}
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 ${
                task.status === 'DONE' 
                  ? 'bg-[#db4c3f] border-[#db4c3f]' 
                  : 'border-gray-300 group-hover:border-gray-400'
              } transition-colors`}
            >
              {task.status === 'DONE' && (
                <CheckCircleIcon className="w-4 h-4 text-white" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`text-gray-900 truncate ${
                  task.status === 'DONE' ? 'line-through text-gray-500' : ''
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <span className="text-xs text-gray-400">Has description</span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{format(task.dueDate, 'MMM d')}</span>
                  </div>
                )}
                <div className={`flex items-center gap-1 text-xs ${getPriorityColor(task.priority)}`}>
                  <FlagIcon className="w-4 h-4" />
                  <span>{task.priority}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setEditingTask(task)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <CalendarIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default TaskList; 