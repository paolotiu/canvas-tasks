import { ConnectedGoogleTask } from '@prisma/client';
import { PlannerItemList } from '@/modules/common/types';

interface FilterPlannerItemsParams {
  connectedGoogleTask: ConnectedGoogleTask;
  plannerItems: PlannerItemList;
}
export const filterPlannerItems = ({
  connectedGoogleTask,
  plannerItems,
}: FilterPlannerItemsParams) => {
  return plannerItems.filter((item) => {
    if (item.plannable_type === 'assignment' && connectedGoogleTask?.includeAssignments) {
      return true;
    }

    if (
      item.plannable_type === 'discussion_topic' &&
      connectedGoogleTask?.includeDiscussionTopics
    ) {
      return true;
    }

    if (item.plannable_type === 'quiz' && connectedGoogleTask?.includeQuizzes) {
      return true;
    }

    return false;
  });
};
