import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_COURSES } from "@/components/courses/config/courses-api";
import type { BackendCourse } from "@/types/course";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

type CourseDetail = BackendCourse & {
  title?: string;
  description?: string;
  instructor?: string;
  avatar?: string;
  category?: string;
  categorySlug?: string;
  level?: string;
  duration?: string;
  lessons?: number;
  rating?: number;
  reviews?: number;
  enrolled?: number;
  price?: number;
  tags?: string[];
  featured?: boolean;
  isNew?: boolean;
};

const normalizeCourse = (value: unknown): CourseDetail | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const course = value as Record<string, unknown>;
  const id = course.id || course._id || course.courseId;
  if (!id) return null;

  return course as CourseDetail;
};

const fetchCourseDetail = async (id: string): Promise<CourseDetail | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/courses/${encodeURIComponent(id)}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json().catch(() => null);
    const course = normalizeCourse(data?.course || data?.data || data);
    return course;
  } catch {
    return null;
  }
};

const getFallbackCourse = (id: string): CourseDetail | null => {
  return (
    ALL_COURSES.find((course) => String(course.id) === String(id)) as CourseDetail | undefined
  ) || null;
};

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const courseId = params.id;
  let course = await fetchCourseDetail(courseId);

  if (!course) {
    course = getFallbackCourse(courseId);
  }

  if (!course) {
    notFound();
  }

  const categoryLabel = course.category || course.courseType || "Course";
  const categorySlug = course.categorySlug || course.courseType?.toLowerCase().replace(/_/g, "-") || "courses";
  const priceText = course.price === 0 || course.price == null ? "Free" : `$${course.price}`;
  const ratingText = course.rating?.toFixed(1) ?? "N/A";

  return (
    <main className="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              <Link href="/courses" className="text-slate-600 hover:text-slate-900 font-medium">
                All courses
              </Link>
              <span className="mx-2">/</span>
              <span>{categoryLabel}</span>
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {course.title || "Course details"}
            </h1>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-sm text-slate-500">Price</div>
            <div className="mt-1 text-xl font-semibold text-slate-900">{priceText}</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {categoryLabel}
              </span>
              {course.isNew && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  New
                </span>
              )}
              {course.featured && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                  Featured
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.16em] text-slate-400">Course overview</p>
                <p className="text-base leading-7 text-slate-700">{course.description || "No course description available."}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4 text-center">
                  <div className="text-sm text-slate-500">Instructor</div>
                  <div className="mt-2 font-semibold text-slate-900">{course.instructor || "TBA"}</div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-center">
                  <div className="text-sm text-slate-500">Duration</div>
                  <div className="mt-2 font-semibold text-slate-900">{course.duration || "TBA"}</div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-center">
                  <div className="text-sm text-slate-500">Lessons</div>
                  <div className="mt-2 font-semibold text-slate-900">{course.lessons ?? "—"}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Course level</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{course.level || "All levels"}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Rating</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{ratingText}</p>
              </div>
            </div>

            {course.tags?.length ? (
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500 mb-3">Skills covered</p>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <aside className="space-y-4 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="text-sm text-slate-500">Course ID</div>
              <div className="mt-2 text-base font-semibold text-slate-900">{course.id}</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="text-sm text-slate-500">Published</div>
              <div className="mt-2 text-base font-semibold text-slate-900">
                {course.isPublished ? "Yes" : "No"}
              </div>
            </div>
            <Link
              href={`/courses`}
              className="block rounded-3xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to courses
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
