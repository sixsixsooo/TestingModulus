const GRAPHQL_ENDPOINT = "http://localhost:3001/graphql";

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string; extensions?: any }>;
}

export async function graphqlRequest<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<GraphQLResponse<T>> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Добавляем токен если есть
        ...(typeof window !== "undefined" &&
          localStorage.getItem("token") && {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("GraphQL request error:", error);
    return {
      errors: [
        { message: error instanceof Error ? error.message : "Unknown error" },
      ],
    };
  }
}

// Готовые запросы
export const queries = {
  GET_USERS: `
    query GetUsers {
      users {
        id
        name
        email
        age
        bio
        location
        gender
        interestedIn
        createdAt
      }
    }
  `,

  GET_USER: `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        email
        age
        bio
        location
        gender
        interestedIn
        createdAt
      }
    }
  `,

  CREATE_USER: `
    mutation CreateUser($input: CreateUserInput!) {
      createUser(createUserInput: $input) {
        id
        name
        email
        age
        bio
        location
        gender
        interestedIn
        createdAt
      }
    }
  `,

  GET_CONVERSATIONS: `
    query GetConversations($userId: ID!) {
      conversations(userId: $userId) {
        user {
          id
          name
          email
        }
        lastMessage {
          id
          content
          createdAt
        }
        unreadCount
      }
    }
  `,

  GET_CONVERSATION: `
    query GetConversation($userId1: ID!, $userId2: ID!) {
      conversation(userId1: $userId1, userId2: $userId2) {
        id
        content
        createdAt
        isRead
        sender {
          id
          name
        }
        receiver {
          id
          name
        }
      }
    }
  `,

  CREATE_MESSAGE: `
    mutation CreateMessage($input: CreateMessageInput!) {
      createMessage(createMessageInput: $input) {
        id
        content
        createdAt
        isRead
        sender {
          id
          name
        }
        receiver {
          id
          name
        }
      }
    }
  `,
};
