export type ChatOrderListType = {
  created_at: string;
  uuid: string;
  status: string;
  chat: {
    message: [];
    attachment: null;
  };
};
export type unReadMessageType = {
  [key: string]: {
    [key: string]: number;
  };
};

export type MessageType = {
  user_uuid: string | undefined;
};

export type ChatMessageType = {
  room: string;
  message: string;
  time: Date | string;
  user_uuid: string;
  user: {
    image: null | string;
  };
  created_at?: string | Date;
  attachment: string;
  order_uuid?: string;
  deleted_at?: null;
  uuid?: string;
  updated_at?: string;
};

export type UnReadMessageType = {
  status: boolean;
  uuid: string;
};
