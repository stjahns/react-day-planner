import { render, screen, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest"
import TaskList from "./TaskList";
import { TaskItem, AddTask } from "./TaskList";
import { type Task } from "../api/tasks";

describe("TaskList", () => {
  it("Uses a default title", () => {
    render(<TaskList />);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("Uses a custom title", () => {
    render(<TaskList title="Hello, world" />);
    expect(screen.getByText("Hello, world")).toBeInTheDocument();
  });

  it("Should render 2 items from the mocked API", async () => {
    render(<TaskList />);
    expect((await screen.findAllByRole("textbox")).length).toEqual(2);
    expect(await screen.findByDisplayValue(/Laundry/)).toBeInTheDocument();
    expect(await screen.findByDisplayValue(/Shopping/)).toBeInTheDocument();
  });

  it("Adds an item when clicking 'Add Item'", async () => {
    render(<TaskList />);

    await waitFor(() => expect(screen.getAllByRole("textbox").length).toEqual(2))

    const button = screen.getByRole("button", { name: /add/i });
    act(() => button.click());

    await waitFor(() => expect(screen.getAllByRole("textbox").length).toEqual(3))
  });

  it("Removes an item when hitting backspace on an empty item'", async () => {
    render(<TaskList />);

    await waitFor(() => expect(screen.getAllByRole("textbox").length).toEqual(2))

    const button = screen.getByRole("button", { name: /add/i });
    act(() => button.click());

    await waitFor(() => expect(screen.getAllByRole("textbox").length).toEqual(3))

    let item = screen.getByDisplayValue<HTMLInputElement>(/^$/);

    const keyEvent = new KeyboardEvent('keydown', {
      key: 'Backspace', code: 'Backspace',
      bubbles: true,
    });

    item.dispatchEvent(keyEvent);
    await waitFor(() => expect(screen.getAllByRole("textbox").length).toEqual(2))
  });
});

describe("AddTask", () => {
  it("Fires callback on button click", () => {
    const onClick = vi.fn();

    render(<AddTask onClick={onClick} />);

    const button = screen.getByRole("button", { name: /add/i });
    button.click();

    expect(onClick).toBeCalled();
  });
});

describe("TaskItem", () => {
  it("Fires deleteItem callback on backspace when label is empty", () => {

    const task: Task = { id: 0, label: "", complete: false };
    const onLabelChanged = vi.fn();
    const onCompleteChanged = vi.fn();
    const deleteItem = vi.fn();
    const addItem = vi.fn();

    render(<TaskItem task={task} onLabelChanged={onLabelChanged} onCompleteChanged={onCompleteChanged} deleteItem={deleteItem} addItem={addItem} />);

    let item = screen.getByDisplayValue<HTMLInputElement>(/^$/);

    const keyEvent = new KeyboardEvent('keydown', {
      key: 'Backspace', code: 'Backspace',
      bubbles: true,
    });

    item.dispatchEvent(keyEvent);

    expect(deleteItem).toBeCalled();
  });

  it("Doest not fire deleteItem callback on backspace when label is not empty", () => {

    const task: Task = { id: 0, label: "meow", complete: false };
    const onLabelChanged = vi.fn();
    const onCompleteChanged = vi.fn();
    const deleteItem = vi.fn();
    const addItem = vi.fn();

    render(<TaskItem task={task} onLabelChanged={onLabelChanged} onCompleteChanged={onCompleteChanged} deleteItem={deleteItem} addItem={addItem} />);

    let item = screen.getByDisplayValue<HTMLInputElement>(/meow/);

    const keyEvent = new KeyboardEvent('keydown', {
      key: 'Backspace', code: 'Backspace',
      bubbles: true,
    });

    item.dispatchEvent(keyEvent);

    expect(deleteItem).not.toBeCalled();
  });
});
