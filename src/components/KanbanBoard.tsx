import { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { useTaskContext } from '../context/TaskContext';
import type { Task, TaskStatus, Column } from '../types';

const KanbanBoard = () => {
  const { tasks, updateTaskStatus } = useTaskContext();

  const columns = useMemo(() => {
    const cols: Column[] = [
      { id: 'TODO', title: 'To Do', tasks: [] },
      { id: 'IN_PROGRESS', title: 'In Progress', tasks: [] },
      { id: 'DONE', title: 'Done', tasks: [] },
    ];

    tasks.forEach((task) => {
      const column = cols.find((col) => col.id === task.status);
      if (column) {
        column.tasks.push(task);
      }
    });

    return cols;
  }, [tasks]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    updateTaskStatus(draggableId, newStatus);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'P1':
        return 'border-l-red-600';
      case 'P2':
        return 'border-l-orange-500';
      case 'P3':
        return 'border-l-yellow-500';
      case 'P4':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-6 flex gap-6 h-[calc(100vh-2rem)] overflow-hidden">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-1 flex flex-col bg-gray-50 rounded-lg p-4"
          >
            <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 overflow-y-auto"
                >
                  <div className="space-y-3">
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`card border-l-4 ${getPriorityColor(
                              task.priority
                            )} ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <h3 className="font-medium">{task.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {task.description}
                              </p>
                              {task.dueDate && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Due: {task.dueDate.toLocaleDateString()}
                                </p>
                              )}
                              <span className="inline-block mt-2 text-xs font-medium text-gray-500">
                                {task.priority}
                              </span>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard; 