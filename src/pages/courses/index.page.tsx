import MainLayout from '@/components/Layouts/MainLayout';
import { trpc } from '@/lib/utils/trpc';

// TODO: Determine color for each course
const Courses = () => {
  const { data } = trpc.useQuery(['courses']);

  return (
    <MainLayout>
      <div
        tw="grid gap-10"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {data?.allCourses?.map((course) => {
          return (
            <div
              key={course.id}
              tw="bg-white pb-4  rounded-sm shadow-sm cursor-pointer border hover:bg-mauve1"
            >
              <div
                tw="h-32"
                style={{
                  backgroundImage: `url(${course.imageUrl})`,
                }}
              ></div>
              <div tw="px-4 pt-4">
                <h5 tw="text-sm line-clamp-1">{course.name}</h5>
                <h3 tw="font-medium">{course.courseCode}</h3>
                <p tw="text-xs text-mauve11">{course.term?.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default Courses;
