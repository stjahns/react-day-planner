import { useEffect, useState } from 'react';
import { type Task } from '../api/tasks'; // FIXME, move elsewhere?
import * as api from '../api/tasks';

// TODO - drag to reorder
// TODO - delete button

interface TaskItemProps {
  task: Task;
  onLabelChanged: React.ChangeEventHandler<HTMLInputElement>;
  onCompleteChanged: React.ChangeEventHandler<HTMLInputElement>;
  deleteItem: (id: number) => void;
  addItem: () => void;
}

export function TaskItem({ task, onLabelChanged, onCompleteChanged, deleteItem, addItem }: TaskItemProps) {

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Backspace") {
      if (task.label.length === 0) {
        deleteItem(task.id);
        // TODO - we want to focus the previous task item after deleting this one
      }
    }
    if (event.key === "Enter") {
      // TODO insert new item in the correct order. We need to define the ordering somehow
      addItem();
    }
  }

  return (
    <div className="flex">
      <input id={task.id.toString()} className="w-4 h-4 m-2"
        type="checkbox" checked={task.complete} onChange={onCompleteChanged} />
      <input className="grow" id={task.id.toString()} type="textarea" value={task.label} onChange={onLabelChanged} onKeyDown={handleKeyDown} autoComplete='off' />
    </div>
  )
}

interface AddTaskProps {
  onClick: () => void;
}

export function AddTask({ onClick }: AddTaskProps) {
  return (
    <button className="w-full text-left" onClick={onClick}>
      [+]   Add
    </button>
  )
}

interface TaskListProps {
  title?: string;
}

export default function TaskList({ title = "Today" }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    api.getTasks().then((data: Task[]) => {
      setTasks(data);
    }).catch(error => console.log(error));
    // TODO - how to handle failure? retry on a timer? use react query?
  }, []);

  const updateTaskState = (updatedTask: Partial<Task>) => {
    const newTasks = tasks.map((task: Task) => {
      if (task.id === updatedTask.id) {
        return { ...task, ...updatedTask };
      } else {
        return task;
      }
    });
    setTasks(newTasks);
  }

  const editTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    const partialTask = { id: Number(event.target.id), label: event.target.value };
    api.updateTask(partialTask);
    updateTaskState(partialTask);
  };

  const completeTask = (id: number, completed: boolean) => {
    const partialTask = { id: id, complete: completed };
    api.updateTask(partialTask);
    updateTaskState(partialTask);
  };

  const completeChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    completeTask(Number(event.target.id), event.target.checked);
  };

  const addTask = () => {
    api.addTask().then((newTask: Task) => {
      const newTasks = [...tasks, newTask];
      setTasks(newTasks);
    }).catch(error => console.log(error));

    // FIXME - waiting for response feels slow, 
    // but we need to know the unique key, unless we generated a GUID here on the client?
    // TODO - how should we handle API failure here?
    // TODO - consider adding a spinner?
  };

  const deleteTask = (id: number) => {
    // FIXME - waiting for response feels slow
    api.deleteTask(id).then(() => {
      const newTasks = tasks.filter((task: Task) => task.id !== id);
      setTasks(newTasks);
    });
  };

  let taskItems = tasks.map((task: Task) =>
    <TaskItem key={task.id}
      task={task}
      onLabelChanged={editTask}
      onCompleteChanged={completeChanged}
      deleteItem={deleteTask}
      addItem={addTask}
    />);

  return (
    <div className="m-2 p-2 pb-3 border-2 rounded-sm border-green-500">
      <h1 className="text-center">{title}</h1>
      {taskItems}
      <AddTask onClick={addTask} />
    </div>
  )
}
