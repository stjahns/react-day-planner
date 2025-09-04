const apiEndpoint = "http://localhost:3000";

export type Task = {
  id: number;
  label: string;
  complete: boolean;
}

export function getTasks(): Promise<Task[]> {
  return fetch(`${apiEndpoint}/tasks`) // TODO configure in environment?
    .then(response => response.json());
}

export function updateTask(task: Partial<Task>): Promise<Task> {
  return fetch(`${apiEndpoint}/tasks/${task.id}`, {
    method: "PATCH",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: task })
  }).then(response => response.json());
}

export function addTask(): Promise<Task> {
  return fetch(`${apiEndpoint}/tasks`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: { label: "", complete: false } })
  }).then(response => response.json());
};

export function deleteTask(id: number): Promise<Response> {
  return fetch(`${apiEndpoint}/tasks/${id}`, {
    method: "DELETE",
    headers: { 'Content-Type': 'application/json' },
  });
};
