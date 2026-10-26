export interface Email {
  email: string;
}

export interface Password {
  password: string;
}

export interface EmailPasswordFields extends Email, Password {}

export interface ConfirmPasswordFields {
  password: string;
  confirmPassword: string;
}
