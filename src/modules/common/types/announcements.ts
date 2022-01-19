// Not comprehensive
export interface RESTCanvasAnnouncement {
  context_code: string;
  message: string;
  title: string;
  user_name: string;
  created_at: string;
  id: number;
  html_url: string;

  posted_at: string;
  author: {
    avatar_image_url: string;
    display_name: string;
  };
}
