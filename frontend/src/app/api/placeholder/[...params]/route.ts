import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  const [width, height] = params.params;

  if (!width || !height) {
    return new NextResponse("Invalid parameters", { status: 400 });
  }

  // Генерируем случайный цвет для placeholder
  const colors = [
    "FF6B6B", // Красный
    "4ECDC4", // Бирюзовый
    "45B7D1", // Голубой
    "96CEB4", // Зеленый
    "FFEAA7", // Желтый
    "DDA0DD", // Сливовый
    "F39C12", // Оранжевый
    "9B59B6", // Фиолетовый
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Перенаправляем на picsum.photos с случайным ID
  const randomId = Math.floor(Math.random() * 1000);
  const url = `https://picsum.photos/${width}/${height}?random=${randomId}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    // Если picsum.photos недоступен, создаем простой SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${randomColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dy=".3em">
          ${width}×${height}
        </text>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }
}
