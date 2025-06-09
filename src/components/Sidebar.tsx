import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ViewListIcon,
  ViewBoardsIcon,
  CalendarIcon,
  PlusIcon,
} from '@heroicons/react/outline';
import { useTaskContext } from '../context/TaskContext';
import AddTaskModal from './AddTaskModal';

const Sidebar = () => {
  const { view, changeView } = useTaskContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navigation = [
    {
      name: 'List View',
      icon: ViewListIcon,
      onClick: () => changeView('list'),
    },
    {
      name: 'Kanban Board',
      icon: ViewBoardsIcon,
      onClick: () => changeView('kanban'),
    },
    {
      name: 'Calendar',
      icon: CalendarIcon,
      onClick: () => {}, // Calendar view will be handled separately
    },
  ];

  return (
    <>
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="h-screen w-64 bg-white border-r border-gray-200 p-4 flex flex-col"
      >
        <div className="mb-8">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Task
          </button>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={item.onClick}
              className={`sidebar-link w-full ${
                view === item.name.toLowerCase().split(' ')[0] ? 'active' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>
      </motion.div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
};

export default Sidebar; 