export interface RequestListPayload {
  personName: string;
  email: string;
  contactNumber?: string;
  text?: string;
  source: string;
  [key: string]: unknown;
}

export interface RequestListResponse {
  success: boolean;
  data: { id: number };
}

const api = {
  user: {
    async postRequestList(payload: RequestListPayload): Promise<RequestListResponse> {
      console.log("[api.user.postRequestList]", payload);
      await new Promise((r) => setTimeout(r, 600));
      return { success: true, data: { id: Math.floor(Math.random() * 100000) } };
    },
  },
};

export default api;
