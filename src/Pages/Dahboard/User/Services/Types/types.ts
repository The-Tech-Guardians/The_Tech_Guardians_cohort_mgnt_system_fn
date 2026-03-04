export interface RequestType {
  id: string;
  type: "REQUEST" | "OFFER";
  categoryId: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  title: string;
  description: string;
  location: string;
  likes: number;
  views: number;
  createdAt: string;
}

export interface ResponseType {
  id: string;
  requestId: string;
  content: string;
  likes: number;
  createdAt: string;
}