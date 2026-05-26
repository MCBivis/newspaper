export type TaskStatus = "todo" | "doing" | "review" | "completed";

export type TaskType = "article" | "photo" | "advertisement" | "layout" | "other";

export type TaskDialogueEntry = {
  author?: string;
  role?: string;
  message: string;
  createdAt: string;
  status?: TaskStatus;
};

export type AppUser = {
  id: number;
  username: string;
  email?: string;
  role?: {
    name?: string;
  } | null;
};

export type TaskRecord = {
  id: number | string;
  name: string;
  description?: string;
  deadline?: string;
  status: TaskStatus;
  taskType?: TaskType;
  dialogue?: TaskDialogueEntry[];
  newspaper?: {
    id: number | string;
    name: string;
    responsibleEditor?: AppUser | null;
  } | null;
  issue?: {
    id: number | string;
    name: string;
  } | null;
  assignee?: AppUser | null;
  articles?: Array<{ id: number | string; name: string }>;
  photos?: Array<{ id: number | string; name: string }>;
  advertisments?: Array<{ id: number | string; Header?: string }>;
};
