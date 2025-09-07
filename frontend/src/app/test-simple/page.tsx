"use client";

import { useState, useEffect } from "react";
import { graphqlRequest, queries } from "../../lib/graphql-client";

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  location?: string;
  gender?: string;
  interestedIn?: string;
  createdAt: string;
}

export default function TestSimplePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await graphqlRequest<{ users: User[] }>(
          queries.GET_USERS
        );

        if (response.errors) {
          setError(response.errors[0].message);
        } else if (response.data) {
          setUsers(response.data.users || []);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных из GraphQL API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500 max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold mb-2">Ошибка подключения к API</h2>
          <p className="text-sm mb-4">{error}</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold mb-2">Возможные причины:</h3>
            <ul className="text-xs space-y-1">
              <li>• Бэкенд не запущен на http://localhost:3001</li>
              <li>• Проблемы с CORS</li>
              <li>• GraphQL схема не готова</li>
              <li>• База данных не подключена</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          🚀 GraphQL API Тест (Простой)
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              ✅ Подключение успешно!
            </h2>
            <div className="flex gap-2">
              <a
                href="http://localhost:3001/graphql"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
              >
                🎮 GraphQL Playground
              </a>
              <a
                href="/test-graphql"
                className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
              >
                Apollo версия
              </a>
            </div>
          </div>

          <div className="grid gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">
                Статус подключения:
              </h3>
              <p className="text-green-700">
                ✅ GraphQL API работает корректно
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                Пользователи в базе:
              </h3>
              <p className="text-blue-700">
                {users.length} пользователей найдено
              </p>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">📭</div>
              <h3 className="font-semibold text-yellow-800 mb-2">
                База данных пуста
              </h3>
              <p className="text-yellow-700 text-sm">
                Пользователи будут добавлены автоматически при первом
                использовании приложения
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">
                Данные пользователей:
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white p-4 rounded-lg border shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                        {user.age && (
                          <div className="text-sm text-gray-500">
                            Возраст: {user.age}
                          </div>
                        )}
                        {user.location && (
                          <div className="text-sm text-gray-500">
                            📍 {user.location}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">ID: {user.id}</div>
                    </div>
                    {user.bio && (
                      <div className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                        {user.bio}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
