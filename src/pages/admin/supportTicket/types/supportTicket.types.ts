export type AdminSupportTicketTableType = {
  ticket_number?: string;
  created_at: string;
  subject: string;
  name: string;
  status: string;
};
export type AdminSupportTicketFilerType = {
  ticket_uuid: string |  undefined
  created_at:string[] | undefined
  company_name: string |undefined;
  status:string | undefined;

}