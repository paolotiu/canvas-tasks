// eslint-disable-next-line @typescript-eslint/ban-types
interface RESTPlannerItemBase<PlannableType extends string, Plannable extends {}> {
  context_type: string;
  course_id: number;
  planner_override: RESTPlannerOverride | null;
  submissions: boolean; //
  /** In the form of `123` */
  plannable_id: number;
  /** In the form of `/courses/1/discussion_topics/8` */
  html_url: string;
  //   plannable_type: 'discussion_topic' | 'assignment' | 'quiz' | 'wiki_page' | 'planner_note';
  plannable_type: PlannableType;
  plannable: Plannable;
  new_activity: boolean;
  context_name: string;
}

export interface RESTPlannableAssignment {
  id: number;
  title: string;
  created_at: Date;
  updated_at: Date;
  due_at: Date;
}

export interface RESTPlannableDiscussionTopic {
  id: number;
  title: string;
  todo_date: Date | null;
  unread_count: number;
  read_state: 'read' | 'unread';
  created_at: Date;
  updated_at: Date;
  assignment_id: number;
  points_possible: number;
  due_at: Date;
}

export interface RESTPlannableQuiz {
  id: number;
  title: string;
  created_at: Date;
  updated_at: Date;
  assignment_id: number;
  points_possible: number;
  due_at?: Date;
}

type RESTPlannerItemAssignment = RESTPlannerItemBase<'assignment', RESTPlannableAssignment>;
type RESTPlannerItemDiscussionTopic = RESTPlannerItemBase<
  'discussion_topic',
  RESTPlannableDiscussionTopic
>;
type RESTPlannerItemQuiz = RESTPlannerItemBase<'quiz', RESTPlannableQuiz>;

export type RESTPlannerItem =
  | RESTPlannerItemAssignment
  | RESTPlannerItemDiscussionTopic
  | RESTPlannerItemQuiz;

export interface RESTPlannerOverride {
  id: number;
  plannable_type: string;
  plannable_id: number;
  user_id: number;
  workflow_state: string;
  marked_complete: boolean; // A user-defined setting for marking items complete in the planner
  dismissed: boolean; // A user-defined setting for hiding items from the opportunities list
  deleted_at: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export type PlannerItemList = Array<RESTPlannerItem>;
