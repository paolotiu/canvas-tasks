import React from 'react';
import Image from 'next/image';
import { SelectedTaskTypes } from '@prisma/client';
import Switch from '@/components/Switch/Switch';
import { trpc } from '@/lib/utils/trpc';
import { inferQueryOutput } from '@/modules/common/types/index';

type TaskTypes = Exclude<keyof SelectedTaskTypes, 'userId' | 'integrationId'>;
type TaskTypesBoolMap = Omit<SelectedTaskTypes, 'userId' | 'integrationId'>;

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
  const mutation = trpc.useMutation('updateTaskConfig');
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
    selectedTaskTypes: TaskTypesBoolMap;
  };
}

const ConnectedGoogleTask = ({ item }: Props) => {
  const mutation = trpc.useMutation('deleteIntegration');
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
        {Object.keys(item.selectedTaskTypes).map((taskType) => {
          return (
            <TaskTypeSwitch
              key={taskType}
              integrationId={item.id}
              taskType={taskType as TaskTypes}
              defaultChecked={item.selectedTaskTypes[taskType as TaskTypes]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ConnectedGoogleTask;
