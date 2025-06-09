import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  InboxIcon,
  CalendarIcon,
  PlusIcon,
  HomeIcon,
  FilterIcon,
  TagIcon,
  ViewListIcon,
  ViewBoardsIcon,
} from '@heroicons/react/outline';
import { useTaskContext } from '../context/TaskContext';
import AddTaskModal from './AddTaskModal';

const Sidebar = () => {
  const { tasks, view, toggleView } = useTaskContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navigation = [
    {
      name: 'Inbox',
      icon: InboxIcon,
      count: tasks.length,
      onClick: () => {},
    },
    {
      name: 'Today',
      icon: CalendarIcon,
      count: tasks.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString()).length,
      onClick: () => {},
    },
    {
      name: 'Filters & Labels',
      icon: FilterIcon,
      onClick: () => {},
    },
  ];

  const views = [
    {
      name: 'List View',
      icon: ViewListIcon,
      isActive: view === 'list',
      onClick: () => view === 'kanban' && toggleView(),
    },
    {
      name: 'Board View',
      icon: ViewBoardsIcon,
      isActive: view === 'kanban',
      onClick: () => view === 'list' && toggleView(),
    },
  ];

  const projects = [
    {
      name: 'Personal',
      icon: HomeIcon,
      onClick: () => {},
    },
    {
      name: 'Work',
      icon: TagIcon,
      onClick: () => {},
    },
  ];

  return (
    <>
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="h-screen w-64 bg-[#fafafa] border-r border-gray-200 flex flex-col"
      >
        <div className="p-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#db4c3f] hover:bg-[#c53727] text-white px-4 py-2 rounded-md transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Task
          </button>
        </div>

        <nav className="flex-1 px-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-md group transition-colors"
              >
                <item.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                <span className="flex-1 text-left">{item.name}</span>
                {item.count && (
                  <span className="text-sm text-gray-500">{item.count}</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="px-3 text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Views
            </h3>
            <div className="space-y-1">
              {views.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md group transition-colors ${
                    item.isActive
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <item.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                  <span className="flex-1 text-left">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="px-3 text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Projects
            </h3>
            <div className="space-y-1">
              {projects.map((project) => (
                <button
                  key={project.name}
                  onClick={project.onClick}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-md group transition-colors"
                >
                  <project.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                  <span className="flex-1 text-left">{project.name}</span>
                </button>
              ))}
            </div>
          </div>
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