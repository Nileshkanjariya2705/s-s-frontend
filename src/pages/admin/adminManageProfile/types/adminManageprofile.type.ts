export interface UpdateProfileInterface {
  username: string;
  email: string;
  password: string;
  phone?: string | null | undefined | number;
  image: File[] | string | undefined | null;

  //////////////////////////
}

export interface AdminProfileDataType {
  username: string;
  email: string;
  uuid: string;
  image: string;
  phone?: string;
  is_active: boolean;
}
