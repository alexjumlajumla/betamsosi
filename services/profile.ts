import request from "./request";
import { MyProfileResponse, ProfileData } from "interfaces/profile.interface";

const profileService = {
  get: (params?: any): Promise<MyProfileResponse> =>
    request.get(`/dashboard/user/profile/show`, { params }),
  update: (data: ProfileData) =>
    request.put(`/dashboard/user/profile/update`, data),
  passwordUpdate: (data: any) =>
    request.post(`/dashboard/user/profile/password/update`, data),
  getNotifications: (params?: any) =>
    request.get(`/dashboard/user/notifications`, { params }),
};

export default profileService;
