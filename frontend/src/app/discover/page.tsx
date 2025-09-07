"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserCard from "../../components/UserCard";
import { Settings, Chat, Person, Favorite, FlashOn } from "@mui/icons-material";

interface User {
  id: string;
  name: string;
  age: number;
  bio?: string;
  location?: string;
  profileImage?: string;
  images?: string[];
}

// Моковые данные пользователей
const mockUsers: User[] = [
  {
    id: "1",
    name: "Анна",
    age: 24,
    bio: "Люблю путешествовать, фотографировать и пить кофе ☕️",
    location: "Москва",
    images: [
      "https://picsum.photos/300/400?random=1",
      "https://picsum.photos/300/400?random=11",
    ],
  },
  {
    id: "2",
    name: "Елена",
    age: 26,
    bio: "Художница, мечтательница, любительница собак 🐕",
    location: "Санкт-Петербург",
    images: ["https://picsum.photos/300/400?random=2"],
  },
  {
    id: "3",
    name: "Мария",
    age: 22,
    bio: "Студентка, танцовщица, всегда в поиске приключений",
    location: "Екатеринбург",
    images: [
      "https://picsum.photos/300/400?random=3",
      "https://picsum.photos/300/400?random=13",
      "https://picsum.photos/300/400?random=23",
    ],
  },
  {
    id: "4",
    name: "Ксения",
    age: 28,
    bio: "IT-специалист днем, музыкант ночью 🎸",
    location: "Новосибирск",
    images: ["https://picsum.photos/300/400?random=4"],
  },
  {
    id: "5",
    name: "Дарья",
    age: 25,
    bio: "Повар, блогер, любительница активного отдыха",
    location: "Казань",
    images: [
      "https://picsum.photos/300/400?random=5",
      "https://picsum.photos/300/400?random=15",
    ],
  },
];

export default function DiscoverPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState(0);
  const [superLikes, setSuperLikes] = useState(3);

  const handleLike = (userId: string) => {
    console.log("Liked user:", userId);
    setMatches((prev) => prev + 1);
    nextUser();
  };

  const handlePass = (userId: string) => {
    console.log("Passed user:", userId);
    nextUser();
  };

  const handleSuperLike = (userId: string) => {
    if (superLikes > 0) {
      console.log("Super liked user:", userId);
      setSuperLikes((prev) => prev - 1);
      setMatches((prev) => prev + 1);
      nextUser();
    }
  };

  const nextUser = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const remainingUsers = users.slice(currentIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Settings className="text-gray-600" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-pink-500">
            <FlashOn />
            <span className="font-semibold">{superLikes}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-500">
            <Favorite />
            <span className="font-semibold">{matches}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Chat className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Person className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        {remainingUsers.length > 0 ? (
          <div className="relative">
            <AnimatePresence>
              {remainingUsers.slice(0, 3).map((user, index) => (
                <motion.div
                  key={user.id}
                  className="absolute"
                  style={{
                    zIndex: remainingUsers.length - index,
                    scale: 1 - index * 0.05,
                    y: index * 10,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1 - index * 0.05,
                    opacity: index < 2 ? 1 : 0.5,
                    y: index * 10,
                  }}
                  exit={{
                    scale: 1.1,
                    opacity: 0,
                    transition: { duration: 0.3 },
                  }}
                >
                  {index === 0 && (
                    <UserCard
                      user={user}
                      onLike={handleLike}
                      onPass={handlePass}
                      onSuperLike={handleSuperLike}
                    />
                  )}
                  {index > 0 && (
                    <div className="w-80 h-[600px] bg-white rounded-3xl shadow-lg pointer-events-none">
                      <div className="h-3/4 bg-gray-200 rounded-t-3xl"></div>
                      <div className="p-6">
                        <div className="h-6 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-12 shadow-xl"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Вы просмотрели всех!
              </h2>
              <p className="text-gray-600 mb-6">
                Скоро появятся новые анкеты. А пока можете посмотреть свои
                совпадения!
              </p>
              <button className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
                Посмотреть совпадения
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <motion.button
          onClick={() =>
            remainingUsers.length > 0 && handlePass(remainingUsers[0].id)
          }
          className="w-16 h-16 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={remainingUsers.length === 0}
        >
          <span className="text-2xl">❌</span>
        </motion.button>

        <motion.button
          onClick={() =>
            remainingUsers.length > 0 && handleSuperLike(remainingUsers[0].id)
          }
          className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={remainingUsers.length === 0 || superLikes === 0}
        >
          <span className="text-2xl">⭐</span>
        </motion.button>

        <motion.button
          onClick={() =>
            remainingUsers.length > 0 && handleLike(remainingUsers[0].id)
          }
          className="w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={remainingUsers.length === 0}
        >
          <span className="text-2xl">❤️</span>
        </motion.button>
      </div>
    </div>
  );
}
