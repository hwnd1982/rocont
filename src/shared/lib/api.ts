import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IBaseResponse<D = any> {
  data:
    | (D & {
        success: boolean;
        error?: string;
      })
    | null;
  status: "error" | "success";
  errors: any[];
}

export function checkResponse(response: Response) {
  if (response.ok) {
    return response.json();
  }

  return Promise.reject(response);
}

export async function sendRequest<R = void, D = void>(
  url: string,
  body?: D,
  method?: "post" | "get",
  init?: AxiosRequestConfig<D>,
): Promise<AxiosResponse<IBaseResponse<R>, any>> {
  return axios[method ?? "post"](url, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...init,
  });
}
