import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cohort LMS",
    template: "%s | Cohort LMS",
  },
  description:
    "A structured Cohort-Based Learning Management Platform enabling secure role-based education, cohort enrollment, and academic progress tracking.",
  keywords: [
    "LMS",
    "Cohort Learning",
    "Education Platform",
    "Online Courses",
    "Next.js LMS",
  ],
  authors: [
    { name: "Freddy Bijanja" },
    { name: "Ndiwayesu Olivier" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
