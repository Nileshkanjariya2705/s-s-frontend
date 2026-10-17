export type SupportTicketTableType = {
  ticket_number: string;
  sending_date: string;
  subject: string;
  status: string;
};

export type SupportTicketFormType = {
  subject: string;
  text: string;
  attachment: File[] | undefined;
};
export type SupportTicketFilterFormType = {
  ticket_uuid: string | undefined;
    created_at: string []| undefined;
    status: string | undefined;
};

export type SupportTicketReplyFormType = {
  text: string | undefined;
  attachment: File[] | string | undefined | null;
};

export type SingleSupportTicketType = {
  created_at: string;
  status: string;
  subject: string;
  ticket_number: number;
  uuid: string;
  supportTicketMessages: SingleSuppTicketMsg[];
};

export type SingleSuppTicketMsg = {
  attachment: string | null;
  created_at: string;
  text: string;
  user_uuid: string;
  user: {
    image: null | string;
    username: string;
  };
};
