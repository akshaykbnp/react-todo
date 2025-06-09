import { useMemo } from 'react';
import { format, isToday, isYesterday, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import { useTaskContext } from '../context/TaskContext';
import type { Task } from '../types';

const TaskList = () => {
  const { tasks } = useTaskContext();

  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: Task[] } = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    tasks.forEach((task) => {
      if (isToday(task.createdAt)) {
        groups.Today.push(task);
      } else if (isYesterday(task.createdAt)) {
        groups.Yesterday.push(task);
      } else if (isBefore(task.createdAt, new Date())) {
        groups.Earlier.push(task);
      }
    });

    return groups;
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
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {Object.entries(groupedTasks).map(([date, tasks]) => (
        <div key={date} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{date}</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{task.title}</h3>
                    <p className="text-gray-600 mt-1">{task.description}</p>
                    {task.dueDate && (
                      <p className="text-sm text-gray-500 mt-2">
                        Due: {format(task.dueDate, 'MMM dd, yyyy')}
                      </p>
                    )}
                  </div>
                  <span
                    className={`font-medium ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      task.status === 'TODO'
                        ? 'bg-gray-100 text-gray-700'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList; 