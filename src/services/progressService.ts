"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token") || localStorage.getItem("token");
};

export interface LearnerProgressRecord {
  learnerId: string;
  lessonId: string;
  courseId: string;
  timeSpent: number;
  completed: boolean;
  lastAccessed: string;
}

export interface LearnerProgressSummary {
  totalLessons: number;
  completedLessons: number;
  completionRate: number;
  totalTimeSpent: number;
}

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json().catch(() => null);
};

export const progressService = {
  async getLearnerCourseProgress(courseId: string): Promise<{
    progress: LearnerProgressRecord[];
    summary: LearnerProgressSummary;
  }> {
    const token = getAuthToken();
    if (!token) {
      return {
        progress: [],
        summary: {
          totalLessons: 0,
          completedLessons: 0,
          completionRate: 0,
          totalTimeSpent: 0,
        },
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/progress/course/${courseId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return {
          progress: [],
          summary: {
            totalLessons: 0,
            completedLessons: 0,
            completionRate: 0,
            totalTimeSpent: 0,
          },
        };
      }

      const data = await parseResponse(response);
      return {
        progress: data?.progress || [],
        summary: data?.summary || {
          totalLessons: 0,
          completedLessons: 0,
          completionRate: 0,
          totalTimeSpent: 0,
        },
      };
    } catch {
      return {
        progress: [],
        summary: {
          totalLessons: 0,
          completedLessons: 0,
          completionRate: 0,
          totalTimeSpent: 0,
        },
      };
    }
  },

  async trackProgress(lessonId: string, timeSpent: number = 0, completed: boolean = false) {
    const token = getAuthToken();
    if (!token) {
      return { success: false, message: "Authentication required" };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/progress/track`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lesson_id: lessonId,
          time_spent: timeSpent,
          completed,
        }),
      });

      const data = await parseResponse(response);
      if (!response.ok) {
        return {
          success: false,
          message: data?.error || data?.message || "Failed to track progress",
        };
      }

      return {
        success: true,
        data,
      };
    } catch {
      return {
        success: false,
        message: "Network error: could not track progress.",
      };
    }
  },
};
