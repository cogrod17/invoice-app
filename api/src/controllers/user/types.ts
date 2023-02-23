export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserFromDB {
  id: number;
  email: string;
  firstname: string | null;
  lastname: string | null;
}

export interface UserRes extends UserFromDB {
  access_token: string;
  refresh_token: string;
}

export type UpdateUser = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
};

export type SetPasswordBody = {
  oldPassword: string;
  newPassword: string;
};
