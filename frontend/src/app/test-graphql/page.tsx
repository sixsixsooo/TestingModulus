"use client";

import { useQuery, gql } from "@apollo/client";

const GET_USERS = gql`
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
`;

export default function TestGraphQLPage() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-bold mb-2">Ошибка подключения к API</h2>
          <p className="text-sm">{error.message}</p>
          <div className="mt-4 text-xs text-gray-500">
            <p>Убедитесь, что бэкенд запущен на http://localhost:3001</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          🚀 GraphQL API Тест
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            ✅ Подключение успешно!
          </h2>

          <div className="grid gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Статус:</h3>
              <p className="text-green-700">GraphQL API работает корректно</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                Пользователи в базе:
              </h3>
              <p className="text-blue-700">
                {data?.users?.length || 0} пользователей
              </p>
            </div>

            {data?.users && data.users.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Данные пользователей:
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {data.users.map((user: any) => (
                    <div key={user.id} className="bg-white p-3 rounded border">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      {user.bio && (
                        <div className="text-sm text-gray-500 mt-1">
                          {user.bio}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <a
              href="http://localhost:3001/graphql"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform"
            >
              🎮 Открыть GraphQL Playground
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
