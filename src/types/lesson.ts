// Lesson Type Definitions

export interface BackendLesson {
  id: string;
  moduleId: string;
  title: string;
  contentType: 'video' | 'pdf' | 'text';
  contentBody?: string;
  contentUrl?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt?: string;
}

// For form data
export interface LessonFormData {
  moduleId: string;
  title: string;
  contentType: 'video' | 'pdf' | 'text';
  contentBody?: string;
  // file/video handled as FormData for upload
  orderIndex: number;
}

