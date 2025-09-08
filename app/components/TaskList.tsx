import { useEffect, useState } from 'react';
import { useMutation, useQuery } from "@apollo/client/react";
//import { type Task } from '../api/tasks'; // FIXME, move elsewhere?
import {
  type Task,
  ADD_TASK,
  COMPLETE_TASK,
  DELETE_TASK,
  GET_TASKS,
  RELABEL_TASK
} from '../api/graphql/tasks';

// TODO - drag to reorder
// TODO - delete button

interface TaskItemProps {
  task: Task;
  onLabelChanged: React.ChangeEventHandler<HTMLInputElement>;
  onCompleteChanged: React.ChangeEventHandler<HTMLInputElement>;
  deleteItem: (id: string) => void;
  addItem: () => void;
}

export function TaskItem({ task, onLabelChanged, onCompleteChanged, deleteItem, addItem }: TaskItemProps) {

  const [label, setLabel] = useState(task.label || "");

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Backspace") {
      if (label.length === 0) {
        deleteItem(task.id);
        // TODO - we want to focus the previous task item after deleting this one
      }
    }
    if (event.key === "Enter") {
      // TODO insert new item in the correct order. We need to define the ordering somehow
      addItem();
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
    onLabelChanged(event);
  };

  return (
    <div className="flex">
      <input id={task.id.toString()} className="w-4 h-4 m-2"
        type="checkbox" checked={task.complete || false} onChange={onCompleteChanged} />
      <input className="grow" id={task.id.toString()} type="textarea" value={label} onChange={handleChange} onKeyDown={handleKeyDown} autoComplete='off' />
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

  const { loading, error, data } = useQuery(GET_TASKS);
  const [mutateComplete] = useMutation(COMPLETE_TASK);
  const [mutateLabel] = useMutation(RELABEL_TASK);
  const [mutateAddTask] = useMutation(ADD_TASK, {
    update(cache, { data }) {

      const { tasks } = cache.readQuery({ query: GET_TASKS }) || { tasks: [] };
      cache.writeQuery({
        query: GET_TASKS,
        data: {
          // FIXME - why doesn't AddTaskMutation include all fields?
          // Need all of them here to fully populate the cache entry, otherwise it'll 
          // need to send another GET_TASKS request
          tasks: [...tasks, { id: data?.addTask?.id, label: "", complete: false, createdAt: "", updatedAt: "" }]
        }
      });

      // TODO - try to get this to work with cache.modify?
      // TODO - can we make this optimistic?
    }
  });
  const [mutateDeleteTask] = useMutation(DELETE_TASK, {
    update(cache, { data }) {

      const { tasks } = cache.readQuery({ query: GET_TASKS }) || { tasks: [] };
      cache.writeQuery({
        query: GET_TASKS,
        data: {
          tasks: tasks.filter(({ id }) => id !== data?.deleteTask?.id)
        }
      });

      // TODO - try to get this to work with cache.modify?
      // TODO - can we make this optimistic?
    }
  });

  if (error) return <p>Error : {error.message}</p>
  if (loading) return <p>Loading...</p>

  const labelChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    mutateLabel({ variables: { id: event.target.id, label: event.target.value } });
  };

  const completeChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    mutateComplete({ variables: { id: event.target.id, complete: event.target.checked } });
  };

  const addTask = () => {
    mutateAddTask();
  };

  const deleteTask = (id: string) => {
    mutateDeleteTask({ variables: { id: id } });
  };

  let taskItems = data?.tasks.map((task: Task) =>
    <TaskItem key={task.id}
      task={task}
      onLabelChanged={labelChanged}
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
