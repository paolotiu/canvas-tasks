import React from 'react';
import Image from 'next/image';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ConnectedGoogleTask as ConnectedGoogleTaskType } from '@prisma/client';
import { FiLoader } from 'react-icons/fi';
import tw from 'twin.macro';
import { useQueryClient } from 'react-query';
import Switch from '@/components/Switch/Switch';
import { trpc } from '@/lib/utils/trpc';
import { inferQueryOutput } from '@/modules/common/types/index';

type NonTaskTypes =
  | 'userId'
  | 'integrationId'
  | 'createdAt'
  | 'updatedAt'
  | 'connectedTaskId'
  | 'id';

type TaskTypes = Exclude<keyof ConnectedGoogleTaskType, NonTaskTypes>;
type TaskTypesBoolMap = Omit<ConnectedGoogleTaskType, NonTaskTypes>;

const TaskTypeLabelMap: { [k in TaskTypes]: string } = {
  includeAssignments: 'Assignments',
  includeDiscussionTopics: 'Discussions',
  includeQuizzes: 'Quizzes',
};

const TaskTypeSwitch = ({
  integrationId,
  taskType,
  ...props
}: {
  integrationId: string;
  taskType: TaskTypes;
} & React.ComponentProps<typeof Switch>) => {
  const mutation = trpc.useMutation('googletasks.updateConfig');
  return (
    <div tw="flex items-center space-x-4  w-full">
      <Switch
        onCheckedChange={(checked) => {
          mutation.mutate({
            [taskType]: checked,
            integrationId,
          });
        }}
        {...props}
      />
      <span>{TaskTypeLabelMap[taskType]}</span>
    </div>
  );
};

type IntegrationsType = inferQueryOutput<'integrations'>;

interface Props {
  item: IntegrationsType[0] & {
    connectedGoogleTask: TaskTypesBoolMap & {
      updatedAt: Date;
    };
  };
}

const ConnectedGoogleTask = ({ item }: Props) => {
  const queryClient = useQueryClient();
  const mutation = trpc.useMutation('deleteIntegration');
  const syncTask = trpc.useMutation('googletasks.sync', {
    onSuccess: () => {
      queryClient.invalidateQueries('integrations');
    },
  });

  return (
    <div key={item.id} tw="p-4 bg-white shadow mb-10">
      <div tw="flex justify-between items-center pb-3">
        <div tw="flex items-center space-x-3">
          <Image
            src="/logos/google-tasks.svg"
            alt="google tasks logo"
            width={35}
            height={35}
            quality={100}
          />
          <div tw="flex-grow">
            <p tw="text-sm font-medium text-mauve12">Google Tasks</p>
            <p tw="text-sm text-mauve11">{item.email}</p>
          </div>
        </div>
        <button
          type="button"
          tw="text-sm font-medium px-3 py-2 hover:bg-red3 hover:text-red11 rounded-sm transition-colors"
          onClick={() => {
            mutation.mutate({
              integrationId: item.id,
            });
          }}
        >
          Disconnect
        </button>
      </div>

      <div tw="border-t pt-4 pb-3 text-sm font-medium space-y-5">
        {Object.keys(item.connectedGoogleTask).map((taskType) => {
          if (taskType === 'updatedAt') return null;
          return (
            <TaskTypeSwitch
              key={taskType}
              integrationId={item.id}
              taskType={taskType as TaskTypes}
              defaultChecked={item.connectedGoogleTask[taskType as TaskTypes]}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          syncTask.mutate({
            integrationId: item.id,
          });
        }}
        disabled={syncTask.isLoading}
        tw="font-medium border text-mauve12 hover:bg-mauve2 text-sm px-4 py-1 rounded-sm mt-2 h-[30px]"
        css={{
          '&:disabled': tw`bg-mauve2`,
        }}
      >
        {syncTask.isLoading ? <FiLoader tw="animate-spin w-[29px]" /> : 'Sync'}
      </button>
      <p tw="text-xs text-mauve9 pt-2">
        Last Updated:{' '}
        {formatDistanceToNow(parseISO(item.connectedGoogleTask.updatedAt as unknown as string), {
          addSuffix: true,
        })}
      </p>
    </div>
  );
};

export default ConnectedGoogleTask;
