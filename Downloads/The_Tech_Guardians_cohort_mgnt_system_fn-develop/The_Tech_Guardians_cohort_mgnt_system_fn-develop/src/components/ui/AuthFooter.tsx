

import Link from "next/link";

export default function AuthFooter() {
  return (
    <p className="text-center text-xs text-gray-400 mt-5">
      &copy;{new Date().getFullYear()}CohortLMS ·{" "}
      <Link href="/privacy" className="hover:underline">
        Privacy
      </Link>{" "}
      ·{" "}
      <Link href="/terms" className="hover:underline">
        Terms
      </Link>
    </p>
  );
}