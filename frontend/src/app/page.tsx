"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignInButton } from "@/components/auth/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Filter, Share2 } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Calendar className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Cal-Scheduler
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Find your available time slots across all your Google Calendars with
            smart filtering and easy sharing
          </p>
          <div className="flex justify-center">
            <SignInButton />
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Multi-Calendar Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access all your Google Calendars including shared calendars from
                teams and organizations
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Smart Time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatically calculate available time slots based on your
                existing calendar events
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Filter className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Flexible Filtering</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Filter by business hours, weekdays only, minimum duration, and
                add buffer time
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Share2 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Easy Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Copy your availability to clipboard or share formatted time
                slots with others
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign In</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect securely with your Google account to access your
                calendars
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-300">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Select & Filter</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose calendars, set time ranges, and apply filters for your
                preferences
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">View & Share</h3>
              <p className="text-gray-600 dark:text-gray-300">
                See your available time slots and easily share them with others
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>Built with Next.js, NextAuth.js, and Google Calendar API</p>
        </div>
      </div>
    </div>
  );
}
