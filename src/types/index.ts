export type Post = {
  id: number;
  user_id?: number;
  cover?: string | null;
  description: string | null;
  created_at?: string;
  updated_at?: string;
  author?: {
    name?: string;
    photo?: string | null;
  };
  likes?: number[] | unknown[];
  comments?: unknown[];
};

export type User = {
  id: number;
  name: string;
  email: string;
  photo?: string | null;
  created_at?: string;
};

export type { RootState, AppDispatch } from "@/store";
