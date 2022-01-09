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
