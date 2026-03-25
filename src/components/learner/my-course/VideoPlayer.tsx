'use client';

import type { Lesson } from '@/services/courseService';

interface VideoPlayerProps {
  lesson: Lesson | null;
}

const isVideoUrl = (url?: string) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|m3u8)(\?.*)?$/i.test(url) || url.includes('cloudinary.com');
};

const toEmbedUrl = (url?: string) => {
  if (!url) return '';

  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
  );
  if (youtubeMatch?.[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  return url;
};

export default function VideoPlayer({ lesson }: VideoPlayerProps) {
  if (!lesson) {
    return (
      <div className="w-full bg-black aspect-video flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-white text-lg font-semibold">Select a lesson</div>
          <p className="text-gray-400 text-sm mt-2">Choose a lesson to start learning.</p>
        </div>
      </div>
    );
  }

  if (lesson.contentType === 'video' && lesson.contentUrl) {
    const embedUrl = toEmbedUrl(lesson.contentUrl);

    if (embedUrl.includes('youtube.com/embed/')) {
      return (
        <div className="w-full bg-black aspect-video">
          <iframe
            src={embedUrl}
            title={lesson.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    if (isVideoUrl(embedUrl)) {
      return (
        <div className="w-full bg-black aspect-video">
          <video controls className="w-full h-full" src={embedUrl}>
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  }

  return (
    <div className="w-full bg-slate-950 aspect-video flex items-center justify-center">
      <div className="text-center px-6 max-w-xl">
        <div className="text-white text-lg font-semibold">{lesson.title}</div>
        <p className="text-gray-400 text-sm mt-2">
          {lesson.contentType === 'pdf'
            ? 'This lesson contains a PDF resource. Open it in the Overview tab.'
            : lesson.contentType === 'text'
              ? 'This lesson uses written content. Read it in the Overview tab.'
              : 'No video file is attached to this lesson yet.'}
        </p>
      </div>
    </div>
  );
}
