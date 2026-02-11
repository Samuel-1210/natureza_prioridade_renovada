import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CollectPointFormData,
  CollectionPointsResponse,
  getCollect,
  getCollectImage,
  postCollect,
} from "../api/collect";

export const useCollect = () => {
  return useMutation({
    mutationFn: (data: CollectPointFormData) => postCollect(data),
  });
};

export const indexCollect = () => {
  return useQuery<CollectionPointsResponse>({
    queryKey: ["collect"],
    queryFn: () => getCollect(),
    enabled: true,
  });
};

export const indexCollectImage = (url: string) => {
  return useQuery({
    queryKey: ["collect", url],
    queryFn: () => getCollectImage(url),
    enabled: true,
  });
};
