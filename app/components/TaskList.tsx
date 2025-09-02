import { useState } from 'react';

type Task = {
  id: number;
  label: string;
  complete: boolean;
};

// TODO - edit task label
// TODO - drag to reorder
// TODO - delete button

interface TaskItemProps {
  task: Task;
  onLabelChanged: React.ChangeEventHandler<HTMLInputElement>;
  onCompleteChanged: React.ChangeEventHandler<HTMLInputElement>;
}

function TaskItem({ task, onLabelChanged, onCompleteChanged }: TaskItemProps) {
  return (
    <div className="">
      <input id={task.id.toString()} className="w-4 h-4 m-2"
        type="checkbox" checked={task.complete} onChange={onCompleteChanged} />
      <input id={task.id.toString()} type="text" value={task.label} onChange={onLabelChanged} />
    </div>
  )
}

let lastId = 0;
let generateId = () => {
  ++lastId;
  return lastId;
}

// TODO fetch from API
const initialTasks: Task[] = [
  { id: generateId(), label: "Hello", complete: false },
  { id: generateId(), label: "World", complete: true },
];

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
  title: string;
}

export default function TaskList({ title = "Today" }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const editTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTasks = tasks.map((task: Task) => {
      if (task.id.toString() === event.target.id) {
        return { ...task, label: event.target.value };
      }
      else {
        return task;
      }
    });
    setTasks(newTasks);
  };

  const completeChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTasks = tasks.map((task: Task) => {
      if (task.id.toString() === event.target.id) {
        return { ...task, complete: event.target.checked };
      }
      else {
        return task;
      }
    });
    setTasks(newTasks);
  };

  let taskItems = tasks.map((task: Task) =>
    <TaskItem key={task.id} task={task} onLabelChanged={editTask} onCompleteChanged={completeChanged} />);

  const addTask = () => {
    const newTasks = [...tasks, { id: generateId(), label: "", complete: false }];
    setTasks(newTasks);
  };

  return (
    <div className="m-2 p-2 pb-3 border-2 rounded-sm border-green-500">
      <h1 className="text-center">{title}</h1>
      {taskItems}
      <AddTask onClick={addTask} />
    </div>
  )
}
