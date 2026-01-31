import { instance } from "./api";

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
  return instance.get("/collection-points").then((res) => res.data);
};

export const getCollectImage = (url: string) => {
  return instance
    .get(
      `/collection-points/storage/collection_points/5Oqa5xBHdYLlcMe4LFtUDDmndEoW4gIO7WTDGh1C.png`,
    )
    .then((res) => res.data);
};
