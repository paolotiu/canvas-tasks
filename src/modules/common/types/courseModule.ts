export type ModuleItemType =
  | 'Page'
  | 'Discussion'
  | 'Assignment'
  | 'Quiz'
  | 'ExternalTool'
  | 'File'
  | 'SubHeader';
export interface RESTLockInfo {
  lock_at: Date | string;
  can_view: boolean;
  asset_string: string;
}

export interface RESTContentDetails {
  locked_for_user: boolean;
  due_at?: Date | string;
  unlock_at?: Date | string;
  lock_at?: Date | string;
  points_possible?: number;
  lock_info: RESTLockInfo;
  lock_explanation: string;
  locked?: boolean;
}

export interface RESTModuleItem {
  id: number;
  title: string;
  position: number;
  indent: number;
  quiz_lti: boolean;
  type: ModuleItemType;
  module_id: number;
  html_url: string;
  page_url: string;
  url: string;
  content_details: RESTContentDetails;
  content_id?: number;
}

export interface RESTCourseModule {
  id: number;
  unlock_at: Date | string;
  name: string;
  position: number;
  require_sequential_progress: boolean;
  publish_final_grade: boolean;
  prerequisite_module_ids: number[];
  state: string;
  completed_at: Date | string;
  items_count: number;
  items_url: string;
  items: RESTModuleItem[];
}
