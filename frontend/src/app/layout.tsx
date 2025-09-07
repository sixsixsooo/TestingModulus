import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
// import CustomApolloProvider from "../components/ApolloProvider";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LoveConnect - Знакомства нового поколения",
  description:
    "Найдите свою вторую половинку с помощью инновационного приложения для знакомств",
  keywords: "знакомства, dating, tinder, любовь, отношения",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-inter antialiased`}>
        <main className="pb-20">{children}</main>
        <Navigation />
      </body>
    </html>
  );
}
