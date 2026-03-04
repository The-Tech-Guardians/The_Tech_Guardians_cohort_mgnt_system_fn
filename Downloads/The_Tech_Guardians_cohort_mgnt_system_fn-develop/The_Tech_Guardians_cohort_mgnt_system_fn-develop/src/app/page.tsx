
import HeroSection from "@/components/Hero";
import WhyJoinSection from "@/components/why-join-us";

export default function Home() {

  return (
    
    <>
    <div className="flex flex-col bg-gray-200">
         <HeroSection/>
         <WhyJoinSection/>
    </div>
    </>
    
  );
}