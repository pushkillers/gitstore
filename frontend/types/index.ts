export interface Project {
  id: number;
  name: string;
  description: string;
  author: string;
  stars: number;
  language: string;
  tags: string[];
  repository?: string;
  createdAt?: string;
  updatedAt?: string;
  price?: number;
  type: "free" | "paid";
  category: string;
  rating: number;
  downloads: number;
  thumbnail?: string;
  screenshots?: string[];
  featured?: boolean;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  members: number;
  projects: number;
  avatar?: string;
  banner?: string;
}

export interface Developer {
  id: number;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  skills: string[];
  projects: number;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  skills: string[];
  budget: {
    type: "fixed" | "hourly" | "range";
    value?: number;
    min?: number;
    max?: number;
  };
  experienceLevel: "junior" | "mid" | "senior" | "expert";
  duration: string;
  location: string;
  status: "open" | "closed";
  urgent: boolean;
  postedAt: string;
  proposalsCount: number;
  client: {
    name: string;
    rating: number;
    jobsPosted: number;
  };
  thumbnail?: string;
}
