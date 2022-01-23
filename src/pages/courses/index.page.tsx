import MainLayout from '@/components/Layouts/MainLayout';
import Link from '@/components/Link/Link';
import { trpc } from '@/lib/utils/trpc';

// TODO: Determine color for each course
const Courses = () => {
  const { data } = trpc.useQuery(['courses'], { staleTime: Infinity });

  return (
    <MainLayout>
      <div
        tw="grid gap-10"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {data?.map((course) => {
          return (
            <Link
              href={`/courses/${course.id}`}
              key={course.id}
              tw="bg-white pb-4 rounded-sm shadow-sm cursor-pointer border hover:bg-mauve2 transition-colors"
            >
              <div
                tw="h-32"
                style={{
                  backgroundSize: 'cover',
                  backgroundImage: course.image_download_url
                    ? `url(${course.image_download_url})`
                    : '',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                }}
              ></div>
              <div tw="px-4 pt-4">
                <h5 tw="text-sm line-clamp-1">{course.name}</h5>
                <h3 tw="font-medium">{course.course_code}</h3>
                <p tw="text-xs text-mauve11">{course.term?.name}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default Courses;
Courses.auth = true;
