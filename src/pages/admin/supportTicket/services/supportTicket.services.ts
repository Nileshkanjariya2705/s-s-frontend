import { axiosGet } from "../../../../axios/method";

export const closeSupportTicket = async (support_ticket_uuid: string) => {
  try {
    const response = await axiosGet("/support-ticket/closeTicket", {
      support_ticket_uuid,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};
