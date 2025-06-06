"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Filter,
  Share2,
  CheckCircle,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "Multi-Calendar Support",
    description:
      "Access all your Google Calendars including shared calendars from teams and organizations",
    gradient: "from-blue-500/10 to-blue-600/5",
    iconBg: "from-blue-500 to-blue-600",
    color: "blue",
  },
  {
    icon: Clock,
    title: "Smart Time Analysis",
    description:
      "Automatically calculate available time slots based on your existing calendar events",
    gradient: "from-green-500/10 to-green-600/5",
    iconBg: "from-green-500 to-green-600",
    color: "green",
  },
  {
    icon: Filter,
    title: "Flexible Filtering",
    description:
      "Filter by business hours, weekdays only, minimum duration, and add buffer time",
    gradient: "from-purple-500/10 to-purple-600/5",
    iconBg: "from-purple-500 to-purple-600",
    color: "purple",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Copy your availability to clipboard or share formatted time slots with others",
    gradient: "from-orange-500/10 to-orange-600/5",
    iconBg: "from-orange-500 to-orange-600",
    color: "orange",
  },
];

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#030303] to-[#050510]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white/60 tracking-wide">
              Key Features
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Everything you need to
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              optimize your schedule
            </span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Powerful features designed to streamline your calendar management
            and make scheduling effortless
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="group relative bg-white/[0.02] backdrop-blur-md border-white/10 hover:bg-white/[0.05] transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 h-full">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <CardHeader className="text-center relative z-10 pb-4">
                  <div
                    className={`mb-4 mx-auto w-16 h-16 bg-gradient-to-br ${feature.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <CardDescription className="text-white/70 leading-relaxed text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
