import { PlannerItemList } from 'src/modules/common/types';
import { canvasAxios } from '@/lib/axios';
import { extractPaginationLink } from '@/lib/utils/extractPaginationLink';

interface ListPlannerItemsParams {
  start_date: Date;
  per_page: number;
  page?: string;
}
/**
 * @link https://canvas.instructure.com/doc/api/planner.html#method.planner.index
 * @description Retrieve the paginated list of objects to be shown on the planner for
 * the current user with the associated planner override to override an item's visibility if set.
 */
export const listPlannerItems = async (params: ListPlannerItemsParams) => {
  const { data, headers } = await canvasAxios.get<PlannerItemList>(`/planner/items`, {
    params,
  });

  const next = extractPaginationLink(headers.link, 'next');

  return {
    data,
    next,
  };
};
