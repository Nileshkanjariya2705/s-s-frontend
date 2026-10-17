export type notificationListType = {
  uuid: string;
  notification_uuid: string;
  receiver_uuid: string;
  is_read: boolean;
  created_at: string;
  notification: {
    [key: string]: string;
  };
};
