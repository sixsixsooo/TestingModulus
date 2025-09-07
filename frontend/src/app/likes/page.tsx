"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowBack, Favorite, Star } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";

interface LikedUser {
  id: string;
  name: string;
  age: number;
  images: string[];
  location?: string;
  isMatch: boolean;
}

// Моковые данные
const mockLikedUsers: LikedUser[] = [
  {
    id: "1",
    name: "Анна",
    age: 25,
    images: ["https://picsum.photos/300/400?random=201"],
    location: "Москва",
    isMatch: true,
  },
  {
    id: "2",
    name: "Мария",
    age: 28,
    images: ["https://picsum.photos/300/400?random=202"],
    location: "Санкт-Петербург",
    isMatch: false,
  },
  {
    id: "3",
    name: "Елена",
    age: 23,
    images: ["https://picsum.photos/300/400?random=203"],
    location: "Казань",
    isMatch: true,
  },
  {
    id: "4",
    name: "София",
    age: 26,
    images: ["https://picsum.photos/300/400?random=204"],
    location: "Новосибирск",
    isMatch: false,
  },
];

export default function LikesPage() {
  const [activeTab, setActiveTab] = useState<"likes" | "matches">("likes");

  const likedUsers = mockLikedUsers;
  const matches = mockLikedUsers.filter((user) => user.isMatch);

  const currentUsers = activeTab === "likes" ? likedUsers : matches;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Link href="/discover">
            <motion.button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowBack className="text-gray-600" />
            </motion.button>
          </Link>

          <h1 className="text-xl font-semibold text-gray-800">
            {activeTab === "likes" ? "Лайки" : "Совпадения"}
          </h1>

          <div className="w-10" />
        </div>

        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("likes")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "likes"
                ? "text-pink-500 border-b-2 border-pink-500"
                : "text-gray-500"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Favorite className="text-sm" />
              Лайки ({likedUsers.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("matches")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "matches"
                ? "text-pink-500 border-b-2 border-pink-500"
                : "text-gray-500"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Star className="text-sm" />
              Совпадения ({matches.length})
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {currentUsers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">
              {activeTab === "likes" ? "💔" : "💕"}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {activeTab === "likes"
                ? "Пока никого не лайкнули"
                : "Пока нет совпадений"}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === "likes"
                ? "Начните свайпать, чтобы найти интересных людей!"
                : "Продолжайте лайкать профили, чтобы найти совпадения!"}
            </p>
            <Link href="/discover">
              <motion.button
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-full font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Начать поиск
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {currentUsers.map((user) => (
              <motion.div
                key={user.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={user.images[0]}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                  {user.isMatch && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Совпадение!
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-gray-800">
                    {user.name}, {user.age}
                  </h3>
                  {user.location && (
                    <p className="text-sm text-gray-500">{user.location}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
