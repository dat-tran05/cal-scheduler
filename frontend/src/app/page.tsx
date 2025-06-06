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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <Calendar className="h-12 w-12 animate-spin mx-auto mb-4 text-white/80" />
          <p className="text-white/60 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-900 via-blue-900 to-indigo-900">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="flex flex-col md:flex-row items-center justify-center mb-8">
            <div className="relative mb-4 md:mb-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-75"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                <Calendar className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent md:ml-6">
              Cal-Scheduler
            </h1>
          </div>

          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Find your available time slots across all your Google Calendars with
            <span className="text-blue-300 font-semibold">
              {" "}
              smart filtering{" "}
            </span>
            and
            <span className="text-purple-300 font-semibold"> easy sharing</span>
          </p>

          <div className="flex justify-center mb-16">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative">
                <SignInButton />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <Card className="group relative bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-lg"></div>
            <CardHeader className="text-center relative z-10">
              <div className="mb-4 mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-white">
                Multi-Calendar Support
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <CardDescription className="text-white/70 leading-relaxed">
                Access all your Google Calendars including shared calendars from
                teams and organizations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-lg"></div>
            <CardHeader className="text-center relative z-10">
              <div className="mb-4 mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-white">
                Smart Time Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <CardDescription className="text-white/70 leading-relaxed">
                Automatically calculate available time slots based on your
                existing calendar events
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg"></div>
            <CardHeader className="text-center relative z-10">
              <div className="mb-4 mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Filter className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-white">
                Flexible Filtering
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <CardDescription className="text-white/70 leading-relaxed">
                Filter by business hours, weekdays only, minimum duration, and
                add buffer time
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-lg"></div>
            <CardHeader className="text-center relative z-10">
              <div className="mb-4 mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Share2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-white">Easy Sharing</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <CardDescription className="text-white/70 leading-relaxed">
                Copy your availability to clipboard or share formatted time
                slots with others
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it works Section */}
        <div className="text-center mb-20">
          <div className="relative inline-block mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              How It Works
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Sign In
              </h3>
              <p className="text-white/70 leading-relaxed">
                Connect securely with your Google account to access your
                calendars with enterprise-grade security
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Select & Filter
              </h3>
              <p className="text-white/70 leading-relaxed">
                Choose calendars, set time ranges, and apply intelligent filters
                for your exact preferences
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">
                View & Share
              </h3>
              <p className="text-white/70 leading-relaxed">
                See your available time slots in beautiful layouts and share
                them effortlessly with others
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-4">
              <p className="text-white/60">
                Built with ❤️ by
                <span className="text-blue-300 font-semibold"> dat</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
