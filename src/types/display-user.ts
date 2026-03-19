export interface DisplayUser {
  initials: string;
  name: string;
  email: string;
  role: "Admin" | "Instructor" | "Learner";
}
