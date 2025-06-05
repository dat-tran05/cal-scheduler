"use client";

import { useSession } from "next-auth/react";
import { Calendar } from "lucide-react";
import { SignInButton } from "@/components/auth/SignInButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white dark:bg-gray-800 shadow border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Cal-Scheduler
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Find your available time slots
                </p>
              </div>
            </div>
          </div>

          {/* User Info and Auth */}
          <div className="flex items-center space-x-4">
            {session?.user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.user.email}
                  </p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback>
                    {session.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <SignInButton />
          </div>
        </div>
      </div>
    </header>
  );
}
