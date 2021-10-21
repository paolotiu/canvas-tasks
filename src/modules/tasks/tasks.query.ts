import gql from 'graphql-tag';

export const ALL_COURSES_ASSIGMENTS_QUERY = gql`
  query allCoursesAssigments($first: Int!, $after: String) {
    allCourses {
      courseCode
      id
      name
      assignmentsConnection(first: $first, after: $after) {
        edges {
          node {
            dueAt
            id
            hasSubmittedSubmissions
          }
        }
      }
    }
  }
`;

export const COURSES_ID = gql`
  query allCoursesId {
    allCourses {
      id
      _id
    }
  }
`;

export const COURSE_ASSIGMENTS_QUERY = gql``;
