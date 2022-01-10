export interface RESTSelf {
  id: number;
  name: string;
  created_at: Date;
  sortable_name: string;
  short_name: string;
  avatar_url: string;
  locale?: any;
  effective_locale: string;
  permissions: {
    can_update_name: boolean;
    can_update_avatar: boolean;
    limit_parent_app_web_access: boolean;
  };
}
