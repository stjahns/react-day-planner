import { ApolloClient, gql, HttpLink, InMemoryCache, type TypedDocumentNode } from "@apollo/client";
import {
  type GetTasksQuery,
  type GetTasksQueryVariables,
  type AddTaskMutation,
  type AddTaskMutationVariables,
  type DeleteTaskMutation,
  type DeleteTaskMutationVariables,
  type RelabelTaskMutation,
  type RelabelTaskMutationVariables,
  type CompleteTaskMutation,
  type CompleteTaskMutationVariables,
} from './__generated__/graphql';

export type { Task } from './__generated__/graphql';

export const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:3000/graphql" }),
  cache: new InMemoryCache(),
});

export const GET_TASKS: TypedDocumentNode<GetTasksQuery, GetTasksQueryVariables> = gql`
  query GetTasks {
    tasks {
      id
      label
      complete
      createdAt
      updatedAt
    }
  }
`;

export const ADD_TASK: TypedDocumentNode<AddTaskMutation, AddTaskMutationVariables> = gql`
  mutation AddTask {
    addTask {
      id
      label
      complete
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TASK: TypedDocumentNode<DeleteTaskMutation, DeleteTaskMutationVariables> = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

export const RELABEL_TASK: TypedDocumentNode<RelabelTaskMutation, RelabelTaskMutationVariables> = gql`
  mutation RelabelTask($id: ID!, $label: String!) {
    relabelTask(id: $id, label: $label) {
      id
      label
    }
  }
`;

export const COMPLETE_TASK: TypedDocumentNode<CompleteTaskMutation, CompleteTaskMutationVariables> = gql`
  mutation CompleteTask($id: ID!, $complete: Boolean!) {
    completeTask(id: $id, complete: $complete) {
      id
      complete
    }
  }
`;
