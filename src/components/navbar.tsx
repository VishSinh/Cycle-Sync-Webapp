"use client"; // Mark this as a Client Component

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AuthService } from "@/service/api/auth-service";
import { Dancing_Script } from "next/font/google";
import { useRouter, usePathname } from "next/navigation";
import { User, LogIn, LogOut, Droplet } from "lucide-react"
import Routes from "@/lib/routes";

// Initialize the font
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter(); // This uses the App Router instead of the Pages Router
  const pathname = usePathname(); // Get current path
  const isOnboardingPage = pathname === Routes.ONBOARDING;

  useEffect(() => {
    // Check authentication status on client-side
    setIsLoggedIn(AuthService.isLoggedIn());
  }, []);

  const handleLogout = async () => {
    router.push(Routes.LOGIN);
    await AuthService.logout();
    setIsLoggedIn(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className={`text-3xl font-bold text-gray-800 ${dancingScript.className}`}>
          Cycle Sync
        </Link>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            isOnboardingPage ? (
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut /> Logout
              </Button>
            ) : (
              <>
                <Link href={Routes.PROFILE}>
                  <Button variant="ghost"><User />Profile</Button>
                </Link>
                <Link href={Routes.CYCLE}>
                  <Button variant="ghost"><Droplet />Cycle</Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut /> Logout
                </Button>
              </>
            )
          ) : (
            <Link href={Routes.LOGIN}>
              <Button variant="ghost"><LogIn /> Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

