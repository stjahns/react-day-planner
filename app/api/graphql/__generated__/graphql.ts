export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ISO8601DateTime: { input: string; output: string; }
};

export type Mutation = {
  __typename: 'Mutation';
  /** Add a new task */
  addTask: Maybe<Task>;
  /** Mark a task as complete */
  completeTask: Maybe<Task>;
  /** Delete an existing task */
  deleteTask: Maybe<Task>;
  /** Update a task's label */
  relabelTask: Maybe<Task>;
};


export type MutationCompleteTaskArgs = {
  complete: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRelabelTaskArgs = {
  id: Scalars['ID']['input'];
  label: Scalars['String']['input'];
};

export type Query = {
  __typename: 'Query';
  /** Query a single task */
  task: Task;
  /** Query a list of tasks */
  tasks: Array<Task>;
};


export type QueryTaskArgs = {
  id: Scalars['ID']['input'];
};

export type Task = {
  __typename: 'Task';
  complete: Maybe<Scalars['Boolean']['output']>;
  createdAt: Scalars['ISO8601DateTime']['output'];
  id: Scalars['ID']['output'];
  label: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['ISO8601DateTime']['output'];
};

export type GetTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTasksQuery = { tasks: Array<{ __typename: 'Task', id: string, label: string | null, complete: boolean | null, createdAt: string, updatedAt: string }> };

export type AddTaskMutationVariables = Exact<{ [key: string]: never; }>;


export type AddTaskMutation = { addTask: { __typename: 'Task', id: string } | null };

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTaskMutation = { deleteTask: { __typename: 'Task', id: string } | null };

export type RelabelTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  label: Scalars['String']['input'];
}>;


export type RelabelTaskMutation = { relabelTask: { __typename: 'Task', id: string, label: string | null } | null };

export type CompleteTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  complete: Scalars['Boolean']['input'];
}>;


export type CompleteTaskMutation = { completeTask: { __typename: 'Task', id: string, complete: boolean | null } | null };
