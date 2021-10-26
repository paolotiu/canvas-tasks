import { extractPaginationLink } from '../extractPaginationLink';

test('correct implementation', () => {
  const res = extractPaginationLink(
    `<https://ateneo.instructure.com/api/v1/planner/items?start_date=2021-10-17T16%3A02%3A19.229Z&page=first&per_page=1>; rel="current",<https://ateneo.instructure.com/api/v1/planner/items?start_date=2021-10-17T16%3A02%3A19.229Z&page=bookmark:WyJ2aWV3aW5nIixbIjIwMjEtMTAtMTkgMTU6NTk6MDAuMDAwMDAwIiwyNjU3NjhdXQ&per_page=1>; rel="next",<https://ateneo.instructure.com/api/v1/planner/items?start_date=2021-10-17T16%3A02%3A19.229Z&page=first&per_page=1>; rel="first"`,
    'next'
  );

  const res2 = extractPaginationLink(
    `	<https://ateneo.instructure.com/api/v1/courses/13980/discussion_topics?only_announcements=true&page=1&per_page=10>; rel="current",<https://ateneo.instructure.com/api/v1/courses/13980/discussion_topics?only_announcements=true&page=2&per_page=10>; rel="next",<https://ateneo.instructure.com/api/v1/courses/13980/discussion_topics?only_announcements=true&page=1&per_page=10>; rel="first",<https://ateneo.instructure.com/api/v1/courses/13980/discussion_topics?only_announcements=true&page=3&per_page=10>; rel="last"`,
    'next'
  );

  expect(res).toBe(
    'https://ateneo.instructure.com/api/v1/planner/items?start_date=2021-10-17T16%3A02%3A19.229Z&page=bookmark:WyJ2aWV3aW5nIixbIjIwMjEtMTAtMTkgMTU6NTk6MDAuMDAwMDAwIiwyNjU3NjhdXQ&per_page=1'
  );

  expect(res2).toBe(
    'https://ateneo.instructure.com/api/v1/courses/13980/discussion_topics?only_announcements=true&page=2&per_page=10'
  );
});
