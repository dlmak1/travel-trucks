import axios from "axios";
import type {
  Camper,
  CampersQueryParams,
  CampersResponse,
  GetCampersParams,
} from "@/types/camper";

interface ApiErrorResponse {
  message?: string | string[];
}

export const api = axios.create({
  baseURL: "https://campers-api.goit.study",
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message = error.response?.data?.message;

      if (typeof message === "string") {
        error.message = message;
      } else if (
        Array.isArray(message) &&
        message.every((part) => typeof part === "string")
      ) {
        error.message = message.join("; ");
      }
    }

    return Promise.reject(error);
  },
);

export async function getCampers(
  params: GetCampersParams = {},
): Promise<CampersResponse> {
  const query: CampersQueryParams = {
    page: params.page ?? 1,
    perPage: params.limit ?? 4,
  };
  const location = params.location?.trim();

  if (location) query.location = location;
  if (params.form) query.form = params.form;
  if (params.engine) query.engine = params.engine;
  if (params.transmission) query.transmission = params.transmission;

  const { data } = await api.get<CampersResponse>("/campers", {
    params: query,
  });

  return data;
}

export async function getCamperById(id: string): Promise<Camper> {
  const camperId = id.trim();

  if (!camperId) {
    throw new Error("Camper ID is required.");
  }

  const { data } = await api.get<Camper>(
    `/campers/${encodeURIComponent(camperId)}`,
  );

  return data;
}
