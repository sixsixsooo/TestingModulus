"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowBack,
  Send,
  MoreVert,
  Favorite,
  Photo,
  EmojiEmotions,
} from "@mui/icons-material";
import Image from "next/image";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  isRead: boolean;
}

interface Chat {
  id: string;
  user: {
    id: string;
    name: string;
    profileImage: string;
    isOnline: boolean;
  };
  lastMessage: Message;
  unreadCount: number;
}

interface User {
  id: string;
  name: string;
  profileImage: string;
  isOnline: boolean;
}

// Моковые данные
const mockChats: Chat[] = [
  {
    id: "1",
    user: {
      id: "1",
      name: "Анна",
      profileImage: "https://picsum.photos/100/100?random=101",
      isOnline: true,
    },
    lastMessage: {
      id: "1",
      content: "Привет! Как дела?",
      senderId: "1",
      receiverId: "current-user",
      createdAt: new Date(),
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: "2",
    user: {
      id: "2",
      name: "Елена",
      profileImage: "https://picsum.photos/100/100?random=102",
      isOnline: false,
    },
    lastMessage: {
      id: "2",
      content: "Спасибо за приятный вечер!",
      senderId: "current-user",
      receiverId: "2",
      createdAt: new Date(Date.now() - 3600000),
      isRead: true,
    },
    unreadCount: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Привет! Как дела?",
    senderId: "1",
    receiverId: "current-user",
    createdAt: new Date(Date.now() - 7200000),
    isRead: true,
  },
  {
    id: "2",
    content: "Привет! Все отлично, а у тебя как?",
    senderId: "current-user",
    receiverId: "1",
    createdAt: new Date(Date.now() - 3600000),
    isRead: true,
  },
  {
    id: "3",
    content: "Тоже все хорошо! Хочешь встретиться на выходных?",
    senderId: "1",
    receiverId: "current-user",
    createdAt: new Date(Date.now() - 1800000),
    isRead: true,
  },
  {
    id: "4",
    content: "Звучит здорово! А что предлагаешь?",
    senderId: "current-user",
    receiverId: "1",
    createdAt: new Date(Date.now() - 900000),
    isRead: true,
  },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [chats] = useState<Chat[]>(mockChats);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: "current-user",
      receiverId: selectedChat.user.id,
      createdAt: new Date(),
      isRead: false,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "только что";
    if (hours < 24) return `${hours}ч назад`;
    return date.toLocaleDateString("ru-RU");
  };

  if (!selectedChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Сообщения
          </h1>
        </div>

        {/* Chat List */}
        <div className="p-4">
          {chats.length > 0 ? (
            <div className="space-y-2">
              {chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={chat.user.profileImage}
                        alt={chat.user.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                      {chat.user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {chat.user.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.lastMessage.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage.senderId === "current-user"
                            ? "Вы: "
                            : ""}
                          {chat.lastMessage.content}
                        </p>
                        {chat.unreadCount > 0 && (
                          <div className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Пока нет сообщений
              </h2>
              <p className="text-gray-600">
                Начните лайкать анкеты, чтобы найти совпадения!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedChat(null)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowBack />
          </button>

          <div className="relative">
            <Image
              src={selectedChat.user.profileImage}
              alt={selectedChat.user.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            {selectedChat.user.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">
              {selectedChat.user.name}
            </h2>
            <p className="text-sm text-gray-600">
              {selectedChat.user.isOnline
                ? "В сети"
                : `Был(а) ${formatLastSeen(new Date())}`}
            </p>
          </div>

          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVert />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.senderId === "current-user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.senderId === "current-user"
                    ? "bg-pink-500 text-white"
                    : "bg-white text-gray-900 shadow-sm"
                }`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderId === "current-user"
                      ? "text-pink-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Photo className="text-gray-600" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Напишите сообщение..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-pink-500 bg-white"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <EmojiEmotions className="text-gray-600" />
            </button>
          </div>

          <motion.button
            onClick={handleSendMessage}
            className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50"
            disabled={!newMessage.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
