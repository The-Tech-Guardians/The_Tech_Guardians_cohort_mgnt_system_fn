"use client";
import DiscoverSomethingNew from "@/components/learner/DiscoverSomethingNew";
import PromotionBanner from "@/components/learner/PromotionBanner";
import CurrentLesson from "@/components/learner/CurrentLesson";
import WelcomeLearner from "@/components/learner/WelcomeLearner";

export default function LearnerPage() {
  return (
    <div className=" max-w-6xl mx-auto   pb-16 space-y-5">
      <WelcomeLearner />
      <CurrentLesson />
      <PromotionBanner />
      <DiscoverSomethingNew />
    </div>
  );
}
