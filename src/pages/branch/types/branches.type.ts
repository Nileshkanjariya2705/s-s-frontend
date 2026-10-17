export interface Branch {
  uuid: string;
  name: string;
  address: string;
  city: string;
  country: string;
  state: string;
  status: string;
  deleted_at: string | null;
}

export interface BranchUser {
  label: string;
  value: string;
}
export interface SingleBranchDataInfo {
  name: string;
  address: string;
  city: string;
  country: string;
  state: string;
  users: (string | undefined)[] | undefined;
  status: string;
  postal_code: string;
  phone: string;
}
