import { ApiParamsType } from "components/table/types";
import { axiosDelete, axiosGet, axiosPost } from "../../../axios/method";

export const createSupportTicket = async (data: FormData) => {
  try {
    const response = await axiosPost("/support-ticket/create", data);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const createSupportTicketReply = async (data: FormData) => {
  try {
    const response = await axiosPost("/support-ticket-message/create", data);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getSupportTicketData = async (
  entity_uuid: string,
  apiParams: ApiParamsType,
  entity_type: string
) => {
  try {
    const response = await axiosGet("/support-ticket/getAll", {
      entity_uuid,
      apiParams,
      entity_type,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const deleteSupportTicket = async (support_ticket_uuid: string) => {
  try {
    const response = await axiosDelete(
      `/support-ticket/delete/${support_ticket_uuid}`
    );
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getSingleSuppTicketData = async (
  support_ticket_uuid: string,
  entity_type: string
) => {
  try {
    const response = await axiosGet("/support-ticket/get", {
      support_ticket_uuid,
      entity_type,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};
