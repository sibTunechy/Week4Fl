import { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      setLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
          title: newTask,
          completed: false,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask('');
    } catch (err) {
      setError('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (task: Task) => {
    try {
      setLoading(true);
      await fetch(`https://jsonplaceholder.typicode.com/todos/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify(task),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      setTasks(tasks.map(t => t.id === task.id ? task : t));
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setLoading(true);
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };
    await updateTask(updatedTask);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Add Task Form */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={addTask}
          disabled={loading}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      )}

      {/* Task List */}
      <ul className="space-y-4">
        {tasks.map(task => (
          <li
            key={task.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {editingTask?.id === task.id ? (
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mr-4"
              />
            ) : (
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => toggleComplete(task)}
                  className={`${task.completed ? 'text-teal-600' : 'text-gray-400'} hover:text-teal-700 transition-colors duration-200`}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                  {task.title}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {editingTask?.id === task.id ? (
                <>
                  <button
                    onClick={() => updateTask(editingTask)}
                    className="text-teal-600 hover:text-teal-700 p-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-blue-600 hover:text-blue-700 p-2"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Empty State */}
      {!loading && tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tasks yet. Add one to get started!
        </div>
      )}
    </div>
  );
};

export default TaskManager;