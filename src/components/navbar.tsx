"use client"; // Mark this as a Client Component

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AuthService } from "@/service/api/auth-service";
import { Dancing_Script } from "next/font/google";
import { useRouter } from "next/navigation"; 

// Initialize the font
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter(); // This uses the App Router instead of the Pages Router

  useEffect(() => {
    // Check authentication status on client-side
    setIsLoggedIn(AuthService.isLoggedIn());
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    setIsLoggedIn(false);
    router.push("/auth");
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className={`text-3xl font-bold text-gray-800 ${dancingScript.className}`}>
          Cycle Sync
        </Link>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}