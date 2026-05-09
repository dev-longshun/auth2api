import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import type { ModelsResponse } from "../types";

export function useModels() {
  return useQuery({
    queryKey: ["v1", "models"],
    queryFn: () => apiFetch<ModelsResponse>("/v1/models"),
    refetchInterval: 60000,
  });
}
