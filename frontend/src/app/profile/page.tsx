"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowBack,
  Edit,
  Settings,
  LocationOn,
  Cake,
  Work,
  School,
  Favorite,
  Star,
  Chat,
  Logout,
  Camera,
} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";

interface UserProfile {
  id: string;
  name: string;
  age: number;
  images: string[];
  location: string;
  bio: string;
  job: string;
  education: string;
  interests: string[];
}

// Моковые данные пользователя
const mockUserProfile: UserProfile = {
  id: "current-user",
  name: "Александр",
  age: 28,
  images: [
    "https://picsum.photos/400/600?random=300",
    "https://picsum.photos/400/600?random=301",
    "https://picsum.photos/400/600?random=302",
  ],
  location: "Москва, Россия",
  bio: "Люблю путешествовать, готовить и читать. Ищу серьезные отношения с интересным человеком.",
  job: "Frontend разработчик",
  education: "МГУ",
  interests: ["Путешествия", "Кулинария", "Фотография", "Музыка", "Спорт"],
};

const stats = [
  { label: "Лайки", value: 127, color: "text-pink-500" },
  { label: "Совпадения", value: 23, color: "text-blue-500" },
  { label: "Чаты", value: 12, color: "text-green-500" },
];

export default function ProfilePage() {
  const [user] = useState<UserProfile>(mockUserProfile);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === user.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? user.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
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

          <h1 className="text-xl font-semibold text-gray-800">Профиль</h1>

          <motion.button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="text-gray-600" />
          </motion.button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Images */}
        <div className="relative">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200">
            <Image
              src={user.images[currentImageIndex]}
              alt={`${user.name} - фото ${currentImageIndex + 1}`}
              fill
              className="object-cover"
            />

            {/* Image Navigation */}
            {user.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white"
                >
                  →
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {user.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Add Photo Button */}
            <motion.button
              className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Camera className="text-gray-700" />
            </motion.button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user.name}, {user.age}
              </h2>
              <div className="flex items-center gap-1 text-gray-600 mt-1">
                <LocationOn className="text-sm" />
                <span>{user.location}</span>
              </div>
            </div>
            <motion.button
              className="p-2 rounded-full bg-pink-50 hover:bg-pink-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit className="text-pink-500" />
            </motion.button>
          </div>

          {/* Bio */}
          <p className="text-gray-700 leading-relaxed mb-4">{user.bio}</p>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Work className="text-gray-500" />
              <span className="text-gray-700">{user.job}</span>
            </div>
            <div className="flex items-center gap-3">
              <School className="text-gray-500" />
              <span className="text-gray-700">{user.education}</span>
            </div>
          </div>

          {/* Interests */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Интересы</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-4 text-center shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/likes">
            <motion.button
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Favorite />
              Мои лайки
            </motion.button>
          </Link>

          <Link href="/chat">
            <motion.button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Chat />
              Чаты
            </motion.button>
          </Link>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <Settings className="text-gray-500" />
            <span className="text-gray-700">Настройки</span>
          </button>

          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <Star className="text-gray-500" />
            <span className="text-gray-700">Премиум</span>
          </button>

          <button className="w-full p-4 flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600">
            <Logout className="text-red-500" />
            <span>Выйти</span>
          </button>
        </div>
      </div>
    </div>
  );
}
