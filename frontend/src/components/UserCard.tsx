"use client";

import { useState, useRef } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Favorite, Close, LocationOn, Cake, Star } from "@mui/icons-material";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  age: number;
  bio?: string;
  location?: string;
  profileImage?: string;
  images?: string[];
}

interface UserCardProps {
  user: User;
  onLike: (userId: string) => void;
  onPass: (userId: string) => void;
  onSuperLike: (userId: string) => void;
}

const UserCard = ({ user, onLike, onPass, onSuperLike }: UserCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const images =
    user.images && user.images.length > 0
      ? user.images
      : [user.profileImage || "/placeholder-profile.jpg"];

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      // Свайп вправо - лайк
      onLike(user.id);
    } else if (info.offset.x < -100) {
      // Свайп влево - пропуск
      onPass(user.id);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      ref={cardRef}
      className="absolute w-80 h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Индикаторы изображений */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
          {images.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1 rounded-full ${
                index === currentImageIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Изображение */}
      <div className="relative h-3/4 overflow-hidden">
        <Image
          src={images[currentImageIndex]}
          alt={user.name}
          fill
          className="object-cover"
          priority
        />

        {/* Кликабельные области для переключения фото */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-0 top-0 w-1/3 h-full z-10 bg-transparent"
            />
            <button
              onClick={nextImage}
              className="absolute right-0 top-0 w-1/3 h-full z-10 bg-transparent"
            />
          </>
        )}

        {/* Градиент снизу */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Информация о пользователе */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <span className="text-xl">{user.age}</span>
        </div>

        {user.location && (
          <div className="flex items-center gap-1 mb-2 text-sm opacity-90">
            <LocationOn className="text-sm" />
            <span>{user.location}</span>
          </div>
        )}

        {user.bio && (
          <p className="text-sm opacity-90 line-clamp-2">{user.bio}</p>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3">
        <motion.button
          onClick={() => onSuperLike(user.id)}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Star />
        </motion.button>

        <motion.button
          onClick={() => onPass(user.id)}
          className="w-12 h-12 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Close />
        </motion.button>

        <motion.button
          onClick={() => onLike(user.id)}
          className="w-12 h-12 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Favorite />
        </motion.button>
      </div>

      {/* Индикаторы свайпа */}
      <motion.div
        className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg"
        style={{
          opacity: useTransform(x, [0, 100], [0, 1]),
          scale: useTransform(x, [0, 100], [0.8, 1.2]),
        }}
      >
        LIKE
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg"
        style={{
          opacity: useTransform(x, [-100, 0], [1, 0]),
          scale: useTransform(x, [-100, 0], [1.2, 0.8]),
        }}
      >
        PASS
      </motion.div>
    </motion.div>
  );
};

export default UserCard;
