"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const hideLayout = pathname?.startsWith("/login") || 
                     pathname?.startsWith("/register") ||
                     pathname?.startsWith("/learner") ||
                     pathname?.startsWith("/instructor") ||
                     pathname?.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
