import './App.css'
import { TaskProvider } from './context/TaskContext';
import { useTaskContext } from './context/TaskContext';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import KanbanBoard from './components/KanbanBoard';

const MainContent = () => {
  const { view } = useTaskContext();

  return (
    <main className="flex-1 overflow-auto">
      {view === 'list' ? <TaskList /> : <KanbanBoard />}
    </main>
  );
};

function App() {
  return (
    <TaskProvider>
      <div className="flex h-screen bg-[#fafafa]">
        <Sidebar />
        <MainContent />
      </div>
    </TaskProvider>
  );
}

export default App
