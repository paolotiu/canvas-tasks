/**
 *
 * @description Extractions link from return pagination header from Canvas API
 * @param str
 * @param rel
 * @returns
 */
export const extractPaginationLink = (str: string, rel: string) => {
  const regex = new RegExp(`<([^>]*)>; rel="${rel}"`);

  const res = regex.exec(str) || [];

  return res[1] || '';
};
