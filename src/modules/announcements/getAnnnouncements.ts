import { canvasAxios } from '@/lib/axios';
import { RESTDiscussionTopicList } from './types';

export const getAnnnouncements = async (courseId: string | number) => {
  const announcements = await canvasAxios.get<RESTDiscussionTopicList>(
    `/courses/${courseId}/discussion_topics`,
    {
      params: {
        only_announcements: true,
      },
    }
  );

  return announcements;
};
