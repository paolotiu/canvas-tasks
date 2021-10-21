import { trpc } from 'src/lib/utils/trpc';

export default function Home() {
  const x = trpc.useQuery(['planner']);

  return (
    <>
      {x.data?.map(({ plannable }) => {
        return <p key={plannable.id}>{plannable.title}</p>;
      })}
    </>
  );
}
