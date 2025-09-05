import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

import { type Task } from './api/tasks'; // FIXME, move elsewhere?

let nextId = 0;

function getNextId(): number {
  return nextId++;
}

const tasks: Task[] = [
  {
    id: getNextId(),
    label: 'Laundry',
    complete: false
  },
  {
    id: getNextId(),
    label: 'Shopping',
    complete: false
  },
]

export const restHandlers = [

  http.get('http://localhost:3000/tasks', () => {
    return HttpResponse.json(tasks)
  }),

  http.patch('http://localhost:3000/tasks/:id', async ({ request }) => {
    const updatedTask = await request.clone().json();
    // Note: we might be missing elements in the response if they aren't in the request body
    return HttpResponse.json(updatedTask);
  }),

  http.post('http://localhost:3000/tasks', async ({ request }) => {
    const body = await request.clone().json();
    const task = body.task;
    task.id = getNextId();
    return HttpResponse.json(task);
  }),

  http.delete('http://localhost:3000/tasks/:id', () => {
    return new HttpResponse('success', { status: 201 });
  }),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test for test isolation
afterEach(() => server.resetHandlers())
