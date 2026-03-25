"use client";

import { useState } from "react";
import { useTranslation } from "@/components/i18n/LanguageProvider";

const NewLetter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { t } = useTranslation();

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100 mb-1">
              {t("footer.newsletter.eyebrow")}
            </p>
            <h3 className="footer-brand text-2xl font-normal">
              {t("footer.newsletter.title")}
            </h3>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-xl px-5 py-3 text-white text-sm font-medium">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {t("footer.newsletter.subscribed")}
            </div>
          ) : (
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder={t("footer.newsletter.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                className="flex-1 md:w-64 bg-white/15 border border-white/25 text-white placeholder-blue-100 text-sm rounded-xl px-4 py-2.5 outline-none focus:bg-white/20 focus:border-white/50 transition-all duration-200"
              />
              <button
                onClick={handleSubscribe}
                className="bg-white text-blue-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all duration-200 whitespace-nowrap shadow-md"
              >
                {t("footer.newsletter.subscribe")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewLetter;
