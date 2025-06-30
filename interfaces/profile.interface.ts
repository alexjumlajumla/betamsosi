import { IUser } from "./user.interface";
import { SuccessResponse } from "./index";

export type MyProfileResponse = SuccessResponse<IUser>;

export interface ProfileData {
  firstname?: string;
  lastname?: string;
  birthday?: string;
  gender?: "male" | "female";
  password?: string;
  password_confirmation?: string;
  images?: string[];
} 