
"use client";

import { PartnersSection } from "./partner_section";
import { TestimonialsSection } from "./testmonials-section";



export default function TestimonialsAndPartners() {
  return (
    <div className="py-12 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        <TestimonialsSection />
        <PartnersSection />
      </div>
    </div>
  );
}
