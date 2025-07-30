export interface Video {
  id: number;
  title: string;
  photo: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  likes: number;
}

export interface ApiResponse {
  error: boolean;
  list: Video[];
  page: number;
  limit: number;
  total: number;
  num_pages: number;
}

export interface DragItem {
  index: number;
  id: number;
  type: string;
}

export interface ColumnOrder {
  rank: number;
  title: number;
  author: number;
  points: number;
}
