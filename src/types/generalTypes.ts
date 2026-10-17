import { LazyExoticComponent } from "react";

export interface RouteInterface {
  path: string;
  element: LazyExoticComponent<React.ComponentType>;
  isPrivate?: boolean;
  isPublic?: boolean;
  isAdmin?: boolean;
  index?: boolean;
  withoutSideBar: boolean;
  isPageNotFound?: boolean;
}
export interface SidebarType {
  name: any;
  icon: string;
  path: string;
  subitems?: { name: any; icon: string; path: string }[];
}
export interface TokenType {
  token: string | null;
}
export interface AddressType {
  address: string;
  Country: string;
  state: string;
  city: string;
  postal_code: number;
  is_default: boolean | undefined;
  address_uuid: string | undefined;
  Phone: string;
  isEditable: boolean | undefined;
}

// address: string; Country: string; state: string; city: string; postal_code: number; is_default: boolean | undefined; address_uuid: string | undefined; user_uuid: string | undefined;
// export interface errorType {
//   message: string;
//   code?: number;
//   status?: number;
//   name?: string;
//   details?: any;
// }

export interface AddressOrderType {
  address: string;
  country: string;
  state: string;
  city: string;
  postal_code: number;
  is_default: boolean | undefined;
  uuid: string;
  phone: string;
  isEditable: boolean | undefined;
}

type ResponseType = "failed" | "success";
export interface ApiResponse {
  data: string;
  message: string;
  toast: boolean;
  responseType: ResponseType;
}
