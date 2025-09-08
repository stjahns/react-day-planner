import { ApolloClient, gql, HttpLink, InMemoryCache, type TypedDocumentNode } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:3000/graphql" }),
  cache: new InMemoryCache(),
});

// TODO look into GraphQL Codegen?

type GetTasksQuery = {
  tasks: Array<{
    id: number;
    label: string;
    complete: boolean;
  }>;
};

type GetTasksQueryVariables = Record<string, never>;

export const GET_TASKS: TypedDocumentNode<GetTasksQuery, GetTasksQueryVariables> = gql`
  query GetTasks {
    tasks {
      id
      label
      complete
    }
  }
`;

type AddTaskMutation = {
  addTask: {
    id: number;
  } | null;
}

type AddTaskQueryVariables = Record<string, never>;

export const ADD_TASK: TypedDocumentNode<AddTaskMutation, AddTaskQueryVariables> = gql`
  mutation AddTask {
    addTask {
      id
    }
  }
`;

type DeleteTaskMutation = {
  deleteTask: {
    id: number;
  } | null;
}

type DeleteTaskMutationVariables = {
  id: number;
};

export const DELETE_TASK: TypedDocumentNode<DeleteTaskMutation, DeleteTaskMutationVariables> = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

type RelabelTaskMutation = {
  relabelTask: {
    id: number;
    label: string;
  } | null;
}

type RelabelTaskMutationVariables = {
  id: number;
  label: string;
};

export const RELABEL_TASK: TypedDocumentNode<RelabelTaskMutation, RelabelTaskMutationVariables> = gql`
  mutation RelabelTask($id: ID!, $label: String!) {
    relabelTask(id: $id, label: $label) {
      id
      label
    }
  }
`;

type CompleteTaskMutation = {
  completeTask: {
    id: number;
    complete: boolean;
  } | null;
}

type CompleteTaskMutationVariables = {
  id: number;
  complete: boolean;
};

export const COMPLETE_TASK: TypedDocumentNode<CompleteTaskMutation, CompleteTaskMutationVariables> = gql`
  mutation CompleteTask($id: ID!, $complete: Boolean!) {
    completeTask(id: $id, complete: $complete) {
      id
      complete
    }
  }
`;
