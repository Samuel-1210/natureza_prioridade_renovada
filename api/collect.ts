import { instance } from "./api";
import { User } from "./user";

export type CollectionPoint = {
  id: number;
  uuid: string;
  user_id: number;
  name: string;
  principal_image: string;
  status: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  description: string | null;
  lat: number | string | null;
  lng: number | string | null;
  rejection_reason: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  contested_at: string | null;
  contestation_deadline: string | null;
  reevaluated_at: string | null;
  created_at: string;
  updated_at: string;
  user: User;
};

export type CollectionPointsResponse = {
  data: CollectionPoint[];
};

export type CollectPointFormData = {
  name: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  description: string;
  principal_image: string;
  images?: string[];
};

export const postCollect = (data: CollectPointFormData) => {
  return instance
    .post("/collection-points", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const getCollect = () => {
  return instance
    .get<CollectionPointsResponse>("/collection-points")
    .then((res) => res.data);
};

export const getCollectImage = (url: string) => {
  return instance.get(url).then((res) => res.data);
};
