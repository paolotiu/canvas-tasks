import { extractPaginationLink } from '../extractPaginationLink';

test('correct implementation', () => {
  const res = extractPaginationLink(
    `<https://ateneo.instructure.com/api/v1/planner/items?start_date=2021-10-17T16%3A02%3A19.229Z&page=first&per_page=1>; rel="current",<https://ateneo.instructure.com/api/v1/planner/items?start_date=2021-10-17T16%3A02%3A19.229Z&page=bookmark:WyJ2aWV3aW5nIixbIjIwMjEtMTAtMTkgMTU6NTk6MDAuMDAwMDAwIiwyNjU3NjhdXQ&per_page=1>; rel="next",<https://ateneo.instructure.com/api/v1/planner/items?start_date=2021-10-17T16%3A02%3A19.229Z&page=first&per_page=1>; rel="first"`,
    'next'
  );

  expect(res).toBe(
    'https://ateneo.instructure.com/api/v1/planner/items?start_date=2021-10-17T16%3A02%3A19.229Z&page=bookmark:WyJ2aWV3aW5nIixbIjIwMjEtMTAtMTkgMTU6NTk6MDAuMDAwMDAwIiwyNjU3NjhdXQ&per_page=1'
  );
});
