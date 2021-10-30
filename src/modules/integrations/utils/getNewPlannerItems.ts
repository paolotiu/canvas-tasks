import differenceWith from 'lodash-es/differenceWith';
import { listPlannerItems } from '@/modules/common';
import { prisma } from '@/server/prisma';

interface GetNewPlannerItemsParams {
  connectedGoogleTaskId: string;
}
export const getNewPlannerItems = async ({ connectedGoogleTaskId }: GetNewPlannerItemsParams) => {
  const { data: plannerItems } = await listPlannerItems({
    per_page: 100,
    start_date: new Date(),
  });

  const plannerItemsId = plannerItems.map((item) => String(item.plannable_id));

  const existingPlannerItems = await prisma.plannerItem.findMany({
    where: {
      id: {
        in: plannerItemsId,
      },
      connectedGoogleTasks: {
        some: {
          id: connectedGoogleTaskId,
        },
      },
    },
  });

  const newPlannerItems = differenceWith(plannerItems, existingPlannerItems, (a, b) => {
    return String(a.plannable_id) === b.id;
  });

  const sortedPlannerItems = newPlannerItems.sort((a, b) => {
    // Sort by due date (desc)
    // Nearer due dates at the top
    const dateA = a.plannable.due_at ? new Date(a.plannable.due_at).getTime() : Infinity;
    const dateB = b.plannable.due_at ? new Date(b.plannable.due_at).getTime() : Infinity;
    return dateA < dateB ? 1 : -1; // ? -1 : 1 for ascending/increasing order
  });

  return sortedPlannerItems;
};
