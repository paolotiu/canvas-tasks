import gql from 'graphql-tag';

export const ALL_COURSES_QUERY = gql`
  query AllCourses {
    allCourses {
      _id
      courseCode
      name
      id
      imageUrl
      term {
        name
      }
    }
  }
`;
export const COURSE_MODULES_QUERY = gql`
  query courseModules($id: ID) {
    course(id: $id) {
      id
      _id
      modulesConnection {
        nodes {
          name
          moduleItems {
            content {
              ... on Page {
                __typename
                id
                title
              }
              ... on Discussion {
                __typename
                id
                title
              }
              ... on Assignment {
                __typename
                id
                name
              }
              ... on Quiz {
                __typename
                id
              }
            }
          }
        }
      }
    }
  }
`;
