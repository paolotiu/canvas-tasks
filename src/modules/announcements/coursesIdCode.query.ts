import gql from 'graphql-tag';

export const ALL_COURSES_ID_CODE_QUERY = gql`
  query allCoursesIdCode {
    allCourses {
      id
      _id
      courseCode
    }
  }
`;
