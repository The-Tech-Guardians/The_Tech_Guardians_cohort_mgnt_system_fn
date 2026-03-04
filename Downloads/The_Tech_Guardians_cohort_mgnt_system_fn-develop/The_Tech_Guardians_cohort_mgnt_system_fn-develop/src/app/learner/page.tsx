"use client";
import DiscoverSomethingNew from "@/components/learner/DiscoverSomethingNew";
import PromotionBanner from "@/components/learner/PromotionBanner";
import CurrentLesson from "@/components/learner/CurrentLesson";
import WelcomeLearner from "@/components/learner/WelcomeLearner";
import { useSidebar } from "./layout";

export default function LearnerPage() {
  const { collapsed } = useSidebar();
  
  return (
    <div className={`pb-16 space-y-5 transition-all duration-300 ${collapsed ? 'mx-4' : 'max-w-6xl mx-auto'}`}>
      <WelcomeLearner />
      <CurrentLesson />
      <PromotionBanner />
      <DiscoverSomethingNew />
    </div>
  );
}
