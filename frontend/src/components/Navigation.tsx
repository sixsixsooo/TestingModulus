"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Explore,
  Chat,
  Person,
  Favorite,
  Star,
} from "@mui/icons-material";

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    {
      icon: Home,
      label: "Главная",
      path: "/",
    },
    {
      icon: Explore,
      label: "Поиск",
      path: "/discover",
    },
    {
      icon: Favorite,
      label: "Лайки",
      path: "/likes",
    },
    {
      icon: Chat,
      label: "Чаты",
      path: "/chat",
    },
    {
      icon: Person,
      label: "Профиль",
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white/90 backdrop-blur-lg border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                    isActive
                      ? "text-pink-500"
                      : "text-gray-600 hover:text-pink-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <Icon className="text-2xl" />
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      isActive ? "font-semibold" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
