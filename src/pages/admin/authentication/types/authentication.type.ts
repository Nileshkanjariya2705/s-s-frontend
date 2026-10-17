export type AdminLoginFormFields = {
  username: string;
  password: string;
  remember: boolean;
};

export type AdminForgotPasswordField = {
  username: string;
};

export type AdminResetPasswordField = {
  password: string;
  confirm_password: string;
};
