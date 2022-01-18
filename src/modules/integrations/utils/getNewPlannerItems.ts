import { listPlannerItems } from '@/modules/common';
import { prisma } from '@/server/prisma';
import { RESTPlannerItem } from '@/modules/common/types';

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
          connectedGoogleTaskId,
        },
      },
    },
    select: {
      id: true,
      updatedAt: true,
      connectedGoogleTasks: {
        select: {
          connectedGoogleTaskId: true,
          googleTaskId: true,
        },
      },
    },
  });

  const existingPlannerItemsMap = existingPlannerItems.reduce<{
    [key: string]: typeof existingPlannerItems[0];
  }>((obj, item) => Object.assign(obj, { [item.id]: item }), {});

  const newPlannerItems = plannerItems.reduce<
    Array<RESTPlannerItem & { connectedTaskId?: string }>
  >((arr, item) => {
    const existing = existingPlannerItemsMap[item.plannable_id];

    if (!existing) {
      // Brand new
      return [...arr, item];
    }

    if (existing.updatedAt.getTime() !== new Date(item.plannable.updated_at).getTime()) {
      // Date changed
      return [
        ...arr,
        {
          ...item,
          connectedTaskId: existing.connectedGoogleTasks.find(
            (t) => t.connectedGoogleTaskId === connectedGoogleTaskId
          )?.googleTaskId,
        },
      ];
    }
    return arr;
  }, []);

  const sortedPlannerItems = newPlannerItems.sort((a, b) => {
    // Sort by due date (desc)
    // Nearer due dates at the top
    const dateA = a.plannable.due_at ? new Date(a.plannable.due_at).getTime() : Infinity;
    const dateB = b.plannable.due_at ? new Date(b.plannable.due_at).getTime() : Infinity;
    return dateA < dateB ? 1 : -1; // ? -1 : 1 for ascending/increasing order
  });

  return sortedPlannerItems;
};
