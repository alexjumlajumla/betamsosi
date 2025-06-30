import { Paginate, SuccessResponse } from "interfaces";
import { IUser, SearchedUser } from "interfaces/user.interface";
import request from "./request";

const profileService = {
  update: (data: any): Promise<SuccessResponse<IUser>> =>
    request.put(`/dashboard/user/profile/update`, data),
  passwordUpdate: (data: any) =>
    request.post(`/dashboard/user/profile/password/update`, data),
  get: (params?: any, headers?: any): Promise<SuccessResponse<IUser>> =>
    request.get(`/dashboard/user/profile/show`, { params, headers }),
  getNotifications: (params?: any) =>
    request.get(`/dashboard/user/notifications`, { params }),
  updateNotifications: (data: any) =>
    request.post(`/dashboard/user/update/notifications`, data),
  firebaseTokenUpdate: async (data: any) => {
    try {
      console.log('[ProfileService] Attempting FCM token update:', {
        endpoint: '/api/v1/fcm-token/update',
        data: { token: data.firebase_token ? '***' + data.firebase_token.substring(-5) : 'null' }
      });
      
      const response = await request.post(`/fcm-token/update`, { token: data.firebase_token });
      console.log('[ProfileService] FCM token update successful:', response);
      return response;
    } catch (error: any) {
      console.error('[ProfileService] FCM token update failed:', {
        error: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // If it's a JSON parsing error, log the raw response
      if (error.message && error.message.includes('Unexpected token')) {
        console.error('[ProfileService] JSON parsing error - raw response:', error.response);
      }
      
      throw error;
    }
  },
  updatePhone: (params: any): Promise<SuccessResponse<IUser>> =>
    request.put(`/dashboard/user/profile/update`, {}, { params }),
  userList: (params?: any): Promise<Paginate<SearchedUser>> =>
    request.get(`/dashboard/user/search-sending`, { params }),
  sendMoney: (data: { price: number; uuid: string }) =>
    request.post(`/dashboard/user/wallet/send`, data),
};

export default profileService;
