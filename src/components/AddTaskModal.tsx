import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, CalendarIcon, FlagIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import { useTaskContext } from '../context/TaskContext';
import type { Priority } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskModal = ({ isOpen, onClose }: AddTaskModalProps) => {
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('P4');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title,
      description,
      priority,
      status: 'TODO',
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('P4');
    setDueDate('');
    setShowDatePicker(false);
  };

  const getPriorityColor = (p: Priority) => {
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

  const getPriorityLabel = (p: Priority) => {
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    Add task
                  </Dialog.Title>
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
                        <span>{dueDate ? format(new Date(dueDate), 'MMM d, yyyy') : 'Due date'}</span>
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
                        {(['P1', 'P2', 'P3', 'P4'] as Priority[]).map((p) => (
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

                  <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200">
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
                      Add task
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddTaskModal; 