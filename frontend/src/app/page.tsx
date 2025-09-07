"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Heart3D, { Heart3DRef } from "../components/Heart3D";
import { Favorite, Chat, Person, Security } from "@mui/icons-material";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heartRef = useRef<Heart3DRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Анимация появления контента при прокрутке
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Обновляем вращение сердца
          if (heartRef.current) {
            heartRef.current.updateRotation(progress);
          }

          // Показываем контент после определенного прогресса
          if (progress > 0.5 && !showContent) {
            setShowContent(true);
            if (heartRef.current) {
              heartRef.current.fadeOut();
            }
          }
        },
      });

      // Анимация появления контента
      if (showContent && contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          {
            opacity: 0,
            y: 100,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [showContent]);

  return (
    <div ref={containerRef} className="relative">
      {/* 3D Сердце */}
      <div className="fixed inset-0 z-10">
        <Heart3D ref={heartRef} />
      </div>

      {/* Контент для прокрутки */}
      <div className="relative z-20 min-h-[300vh]">
        {/* Пустое пространство для прокрутки */}
        <div className="h-screen" />

        {/* Информационный блок */}
        <div
          ref={contentRef}
          className={`min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white p-8 transition-opacity duration-1000 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-6xl mx-auto py-20">
            <div className="text-center mb-16">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                LoveConnect
              </h1>
              <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Откройте для себя новый способ знакомств с помощью нашего
                инновационного приложения
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-pink-400/50 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center mb-6">
                  <Favorite className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Умные лайки</h3>
                <p className="text-gray-400">
                  Система машинного обучения подбирает идеальные совпадения на
                  основе ваших предпочтений
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-6">
                  <Chat className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Безопасные чаты</h3>
                <p className="text-gray-400">
                  Зашифрованная система сообщений с возможностью видеозвонков и
                  голосовых сообщений
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-6">
                  <Person className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Проверенные профили
                </h3>
                <p className="text-gray-400">
                  Все пользователи проходят верификацию для обеспечения
                  подлинности и безопасности
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6">
                  <Security className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Премиум функции</h3>
                <p className="text-gray-400">
                  Расширенные возможности поиска, суперлайки и возможность
                  видеть, кто вас лайкнул
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-pink-500/25">
                  Начать знакомства
                </button>
                <button className="border-2 border-white/30 hover:border-white/60 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 backdrop-blur-lg">
                  Узнать больше
                </button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400 mb-2">
                    1M+
                  </div>
                  <div className="text-gray-400">Активных пользователей</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    50K+
                  </div>
                  <div className="text-gray-400">Успешных пар</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    4.9★
                  </div>
                  <div className="text-gray-400">Рейтинг в App Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
