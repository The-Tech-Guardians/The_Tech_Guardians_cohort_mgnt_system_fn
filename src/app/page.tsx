
import HeroSection from "@/components/Hero";
import TestimonialsAndPartners from "@/components/TestmoniolsAndPartners";
import WhyJoinSection from "@/components/why-join-us";

export default function Home() {

  return (
    
    <>
    <div className="flex flex-col ">
         <HeroSection/>
         <WhyJoinSection/>
         <TestimonialsAndPartners/>
    </div>
    </>
    
  );
}