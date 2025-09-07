"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

interface Heart3DProps {
  scrollProgress?: number;
}

export interface Heart3DRef {
  updateRotation: (progress: number) => void;
  fadeOut: () => void;
}

const Heart3D = forwardRef<Heart3DRef, Heart3DProps>(
  ({ scrollProgress = 0 }, ref) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const heartRef = useRef<THREE.Mesh | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationIdRef = useRef<number>();

    useImperativeHandle(ref, () => ({
      updateRotation: (progress: number) => {
        if (heartRef.current) {
          heartRef.current.rotation.y = progress * Math.PI * 4; // Ускоренное вращение
          heartRef.current.rotation.x = Math.sin(progress * Math.PI * 2) * 0.2;
          heartRef.current.scale.setScalar(1 + progress * 0.5);
        }
      },
      fadeOut: () => {
        if (mountRef.current) {
          gsap.to(mountRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
          });
        }
      },
    }));

    useEffect(() => {
      if (!mountRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Создание сцены
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x000000, 1, 100);
      sceneRef.current = scene;

      // Создание камеры
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 8;

      // Создание рендерера с улучшенными настройками
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      rendererRef.current = renderer;

      mountRef.current.appendChild(renderer.domElement);

      // Создание формы сердца с более детализированной геометрией
      const heartShape = new THREE.Shape();
      const x = 0,
        y = 0;
      heartShape.moveTo(x + 0, y + 0.5);
      heartShape.bezierCurveTo(
        x + 0.5,
        y + 1.5,
        x + 2,
        y + 1.5,
        x + 2,
        y + 0.5
      );
      heartShape.bezierCurveTo(x + 2, y + 0, x + 1.5, y - 0.5, x + 1, y - 1);
      heartShape.bezierCurveTo(x + 0.5, y - 1.5, x + 0, y - 2, x + 0, y - 2.5);
      heartShape.bezierCurveTo(x + 0, y - 2, x - 0.5, y - 1.5, x - 1, y - 1);
      heartShape.bezierCurveTo(x - 1.5, y - 0.5, x - 2, y + 0, x - 2, y + 0.5);
      heartShape.bezierCurveTo(
        x - 2,
        y + 1.5,
        x - 0.5,
        y + 1.5,
        x + 0,
        y + 0.5
      );

      const extrudeSettings = {
        depth: 0.8,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 8,
        curveSegments: 32,
      };

      const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

      // Создание материала с градиентом и эмиссией
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xff1744,
        metalness: 0.1,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        emissive: 0x441122,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9,
      });

      const heart = new THREE.Mesh(geometry, material);
      heart.castShadow = true;
      heart.receiveShadow = true;
      heart.position.y = -0.5;
      scene.add(heart);
      heartRef.current = heart;

      // Создание частиц вокруг сердца
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 1000;
      const positions = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particlesMaterial = new THREE.PointsMaterial({
        color: 0xff6b9d,
        size: 0.02,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Кинематографическое освещение
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);

      // Основной свет (key light)
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
      keyLight.position.set(5, 5, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 50;
      keyLight.shadow.bias = -0.0001;
      scene.add(keyLight);

      // Заполняющий свет (fill light)
      const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.8);
      fillLight.position.set(-3, 2, 4);
      scene.add(fillLight);

      // Контровой свет (rim light)
      const rimLight = new THREE.DirectionalLight(0xff69b4, 1.2);
      rimLight.position.set(-5, -5, -5);
      scene.add(rimLight);

      // Точечные огни для дополнительного эффекта
      const pointLight1 = new THREE.PointLight(0xff1744, 1, 10);
      pointLight1.position.set(2, 2, 2);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x44ff17, 0.5, 8);
      pointLight2.position.set(-2, -2, 3);
      scene.add(pointLight2);

      // Анимация
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);

        // Базовая анимация сердца
        if (heartRef.current) {
          heartRef.current.rotation.y += 0.005;
          heartRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;

          // Пульсация
          const scale = 1 + Math.sin(Date.now() * 0.003) * 0.05;
          heartRef.current.scale.setScalar(scale);
        }

        // Анимация частиц
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;

        // Анимация огней
        pointLight1.intensity = 0.8 + Math.sin(Date.now() * 0.002) * 0.3;
        pointLight2.intensity = 0.3 + Math.cos(Date.now() * 0.003) * 0.2;

        renderer.render(scene, camera);
      };

      animate();

      // Обработка изменения размера окна
      const handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener("resize", handleResize);

      // Очистка при размонтировании
      return () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        window.removeEventListener("resize", handleResize);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        particlesGeometry.dispose();
        particlesMaterial.dispose();
      };
    }, []);

    return (
      <div
        ref={mountRef}
        className="fixed inset-0 w-full h-full z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(20,20,40,0.9) 0%, rgba(0,0,0,1) 100%)",
        }}
      />
    );
  }
);

Heart3D.displayName = "Heart3D";

export default Heart3D;
