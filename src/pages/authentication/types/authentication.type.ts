export interface LoginInterFace {
  username: string;
  password: string;
  remember: boolean;
  reCAPTCHAtoken?:string
}

export type varientType = "STORE" | "SUPPLIER";
export interface SignUpInterface {
  username: string;
  email: string;
  company_name: string;
  cr_number: string;
  tax_number?: string | null;
  password: string;
  confirm_password: string;
  varient?: string;
}

export type ForgotPasswordField = {
  username: string;
};
