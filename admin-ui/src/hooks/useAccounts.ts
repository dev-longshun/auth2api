import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import type { AdminAccountsResponse } from "../types";

export function useAccounts() {
  return useQuery({
    queryKey: ["admin", "accounts"],
    queryFn: () => apiFetch<AdminAccountsResponse>("/admin/accounts"),
    refetchInterval: 10000,
  });
}
