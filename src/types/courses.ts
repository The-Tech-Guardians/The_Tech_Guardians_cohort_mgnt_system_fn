 type Level = "Beginner" | "Intermediate" | "Advanced";
export interface Course {
  id: number;
  title: string;
  instructor: string;
  avatar: string;
  category: string;
  categorySlug: string;
  level: Level;
  duration: string;
  lessons: number;
  rating: number;
  reviews: number;
  enrolled: number;
  price: number;
  tags: string[];
  description: string;
  featured?: boolean;
  isNew?: boolean;
}