import { notificationListType } from "pages/notification/types/notification.type";
type KeyType = "STORE" | "SUPPLIER" | "ADMIN";
export type NotificationEntity =
  | "PURCHASE_REQUEST"
  | "PURCHASE_REQUEST_REJECT"
  | "PURCHASE_REQUEST_CLOSED"
  | "SUPPORT_TICKET"
  | "CHAT"
  | "STORE_USER"
  | "SUPPLIER_USER"
  | "ORDER"
  | "PAYMENT_APPROVAL"
  | "NEW_ORDER_REPLACEMENT"
  | "ORDER_REPLACEMENT_REJECT"
  | "ORDER_REPLACEMENT_APPROVAL"
  | "NEW_ORDER_REFUND"
  | "ORDER_REFUND_APPROVAL"
  | "ORDER_REFUND_REJECT";

interface NotificationLinks {
  [key: string]: Partial<{ [key in KeyType]: (id: string) => string }>;
}
interface NotificationLinksParams {
  id: string;
}
export type NotificationLinksType = {
  [K in NotificationEntity]: {
    [P in keyof NotificationLinks]: (params: NotificationLinksParams) => string;
  };
};
export const notificationLinks: NotificationLinksType = {
  PURCHASE_REQUEST: {
    STORE: ({ id }) => `/purchase-request/view/${id}`,
    SUPPLIER: ({ id }) => `/purchase-request/view/open/${id}`,
  },
  PURCHASE_REQUEST_CLOSED: {
    SUPPLIER: ({ id }) => `/purchase-request/view/closed/${id}`,
  },
  PURCHASE_REQUEST_REJECT: {
    STORE: ({ id }) => `/purchase-request/view/${id}`,
    SUPPLIER: ({ id }) => `/purchase-request/view/quoted/${id}`,
  },
  SUPPORT_TICKET: {
    STORE: ({ id }) => `/support-ticket/view/${id}`,
    SUPPLIER: ({ id }) => `/support-ticket/view/${id}`,
    ADMIN: ({ id }) => `/admin/support-ticket/view/${id}`,
  },
  CHAT: {
    STORE: ({ id }) => `/chat/${id}`,
    SUPPLIER: ({ id }) => `/chat/${id}`,
  },
  STORE_USER: {
    ADMIN: ({ id }) => `/admin/store/view/${id}`,
  },
  SUPPLIER_USER: {
    ADMIN: ({ id }) => `/admin/supplier/view/${id}`,
  },
  ORDER: {
    STORE: ({ id }) => `/purchase-history/${id}`,
    SUPPLIER: ({ id }) => `/orders/view/${id}`,
    // ADMIN: (id: string) => `admin/purchase-requests/${id}`,
    ADMIN:({ id }) => `/admin/refund-orders/view-order/${id}`,
  },
  PAYMENT_APPROVAL: {
    ADMIN: ({ id }) => `/admin/bank-transfer/view/${id}`,
    STORE: ({ id }) =>`/bank-transfer-order/${id}`
  },
  NEW_ORDER_REPLACEMENT: {
    SUPPLIER: ({ id }) => `/replace-orders/view/${id}`,
  },
  ORDER_REPLACEMENT_REJECT: {
    STORE: ({ id }) => `/replacement-orders/${id}`,
  },
  ORDER_REPLACEMENT_APPROVAL: {
    STORE: ({ id }) => `/replacement-orders/${id}`,
    ADMIN:({ id }) => `/admin/refund-orders/view-order/${id}`,
  },
  NEW_ORDER_REFUND:{
    SUPPLIER:({ id }) => `/refund-orders/view/${id}`
  },
  ORDER_REFUND_APPROVAL:{
    STORE: ({ id }) => `/refund-orders/${id}`,
  },
  ORDER_REFUND_REJECT:{
    STORE: ({ id }) => `/refund-orders/${id}`,
  }
};

export const HandlePermissionWiseDisplayNotification = (
  allNotification: notificationListType[],
  given_permissions: {
    uuid: string;
    name: string;
    permission_type: string;
    granted: boolean;
  }[],
  entity_type: string
) => {
  const notificationList: notificationListType[] = [];
  allNotification.forEach((obj) => {
    if (
      obj.notification.related_entity_type === "CHAT" &&
      given_permissions.some(
        (obj2) => obj2.name === "chat" && obj2.granted === true
      )
    ) {
      notificationList.push(obj);
    } else if (
      (obj.notification.related_entity_type === "ORDERS" || obj.notification.related_entity_type==="ORDER_REPLACEMENT_REJECT" || obj.notification.related_entity_type==="ORDER_REPLACEMENT_APPROVAL" ||obj.notification.related_entity_type==="ORDER_REFUND_APPROVAL" || obj.notification.related_entity_type==="ORDER_REFUND_REJECT" ) &&
      entity_type === "STORE"
    ) {
      notificationList.push(obj);
    } else if (
     ( obj.notification.related_entity_type === "ORDERS" || obj.notification.related_entity_type==="NEW_ORDER_REPLACEMENT"|| obj.notification.related_entity_type==="NEW_ORDER_REFUND") &&
      entity_type === "SUPPLIER" &&
      given_permissions.some(
        (obj2) => obj2.name === "View Orders" && obj2.granted === true
      )
    ) {
      notificationList.push(obj);
    } else if (
      obj.notification.related_entity_type === "SUPPORT_TICKET" &&
      given_permissions.some(
        (obj2) =>
          obj2.name === "View All support tickets" && obj2.granted === true
      )
    ) {
      notificationList.push(obj);
    } else if (
      obj.notification.related_entity_type === "PURCHASE_REQUEST" &&
      given_permissions.some(
        (obj2) => obj2.name === "Manage Products Req." && obj2.granted === true
      )
    ) {
      notificationList.push(obj);
    } else if (
      obj.notification.related_entity_type === "PURCHASE_REQUEST" &&
      given_permissions.some(
        (obj2) =>
          obj2.name === "Track Purchase Request" && obj2.granted === true
      )
    ) {
      notificationList.push(obj);
    }
     else if (
      obj.notification.related_entity_type === "PAYMENT_APPROVAL" &&
      given_permissions.some(
        (obj2) =>
          obj2.name === "Checkout Quote" && obj2.granted === true
      )
    ) {
      notificationList.push(obj);
    }
  });
  return notificationList;
};
