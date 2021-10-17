import gql from 'graphql-tag';

export const GET_ASSIGNMENTS = gql`
  query A {
    allCourses {
      name
      assignmentsConnection(first: 10) {
        nodes {
          name
          dueAt
        }
      }
    }
  }
`;
