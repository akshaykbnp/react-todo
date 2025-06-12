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
  XIcon,
  EyeIcon
} from '@heroicons/react/outline';
import { useTaskContext } from '../context/TaskContext';
import type { Task } from '../types';
import AddTaskModal from './AddTaskModal';

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

interface ViewTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

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

const ViewTaskModal = ({ task, isOpen, onClose }: ViewTaskModalProps) => {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Title</h3>
                <p className="mt-1 text-gray-900">{task.title}</p>
              </div>

              {task.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{task.description}</p>
                </div>
              )}

              <div className="flex items-center gap-4">
                {task.dueDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                    <p className="mt-1 text-gray-900">{format(task.dueDate, 'MMM d, yyyy')}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                  <div className={`flex items-center gap-1 mt-1 ${getPriorityColor(task.priority)}`}>
                    <FlagIcon className="w-4 h-4" />
                    <span>{task.priority}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 text-gray-900">{task.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditTaskModal = ({ task, isOpen, onClose }: EditTaskModalProps) => {
  const { updateTask, deleteTask } = useTaskContext();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : ''
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

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

  const handlePrioritySelect = (p: Task['priority']) => {
    setPriority(p);
    setShowPriorityDropdown(false);
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

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 rounded-md transition-colors ${getPriorityColor(priority)}`}
                  >
                    <FlagIcon className="w-5 h-5" />
                    <span>P{priority[1]}</span>
                  </button>
                  {showPriorityDropdown && (
                    <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      {(['P1', 'P2', 'P3', 'P4'] as Task['priority'][]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePrioritySelect(p)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                            priority === p ? 'bg-gray-50' : ''
                          } ${getPriorityColor(p)}`}
                        >
                          <FlagIcon className="w-4 h-4" />
                          <span>{getPriorityLabel(p)}</span>
                        </button>
                      ))}
                    </div>
                  )}
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
  const { filteredTasks, toggleView, view, updateTaskStatus, activeFilter, updateTask } = useTaskContext();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [datePickerTask, setDatePickerTask] = useState<Task | null>(null);

  const groupedTasks = useMemo(() => {
    if (activeFilter === 'priority') {
      // For priority view, group by all priority levels
      const p1Tasks = filteredTasks.filter(task => task.priority === 'P1');
      const p2Tasks = filteredTasks.filter(task => task.priority === 'P2');
      const p3Tasks = filteredTasks.filter(task => task.priority === 'P3');
      const p4Tasks = filteredTasks.filter(task => task.priority === 'P4');
      
      return [
        { title: 'Priority 1 (Urgent)', tasks: p1Tasks },
        { title: 'Priority 2 (High)', tasks: p2Tasks },
        { title: 'Priority 3 (Medium)', tasks: p3Tasks },
        { title: 'Priority 4 (Low)', tasks: p4Tasks },
      ].filter(group => group.tasks.length > 0);
    }

    // For other views, group by date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const groups = filteredTasks.reduce((acc, task) => {
      if (!task.dueDate) {
        acc.noDueDate.push(task);
        return acc;
      }

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate.getTime() < today.getTime()) {
        acc.overdue.push(task);
      } else if (dueDate.getTime() === today.getTime()) {
        acc.today.push(task);
      } else if (dueDate.getTime() === tomorrow.getTime()) {
        acc.tomorrow.push(task);
      } else if (dueDate.getTime() <= nextWeek.getTime()) {
        acc.thisWeek.push(task);
      } else {
        acc.later.push(task);
      }

      return acc;
    }, {
      overdue: [] as Task[],
      today: [] as Task[],
      tomorrow: [] as Task[],
      thisWeek: [] as Task[],
      later: [] as Task[],
      noDueDate: [] as Task[],
    });

    return [
      { title: 'Overdue', tasks: groups.overdue },
      { title: 'Today', tasks: groups.today },
      { title: 'Tomorrow', tasks: groups.tomorrow },
      { title: 'This Week', tasks: groups.thisWeek },
      { title: 'Later', tasks: groups.later },
      { title: 'No Due Date', tasks: groups.noDueDate },
    ].filter(group => group.tasks.length > 0);
  }, [filteredTasks, activeFilter]);

  const getPageTitle = () => {
    switch (activeFilter) {
      case 'inbox':
        return 'Inbox';
      case 'today':
        return 'Today';
      case 'priority':
        return 'Priority Tasks';
      default:
        return 'Tasks';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
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
      
      <div className="space-y-6">
        {groupedTasks.map((group) => (
          <div key={group.title} className="space-y-1">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              {group.title}
            </h2>
            {group.tasks.map((task) => (
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
                  } transition-colors cursor-pointer`}
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
                    onClick={() => setViewingTask(task)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded cursor-pointer"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setEditingTask(task)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded cursor-pointer"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setDatePickerTask(task)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded cursor-pointer"
                  >
                    <CalendarIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {viewingTask && (
        <ViewTaskModal
          task={viewingTask}
          isOpen={!!viewingTask}
          onClose={() => setViewingTask(null)}
        />
      )}

      {datePickerTask && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm" onClick={() => setDatePickerTask(null)} />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Change Due Date</h2>
                  <button
                    onClick={() => setDatePickerTask(null)}
                    className="text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="date"
                    value={datePickerTask.dueDate ? format(datePickerTask.dueDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      const newDate = e.target.value ? new Date(e.target.value) : undefined;
                      updateTask({
                        ...datePickerTask,
                        dueDate: newDate
                      });
                      setDatePickerTask(null);
                    }}
                    className="w-full px-3 py-2 text-gray-900 border rounded-md border-gray-200 focus:border-[#db4c3f] focus:ring-1 focus:ring-[#db4c3f]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default TaskList; 