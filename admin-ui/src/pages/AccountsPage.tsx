import { useAccounts } from "../hooks/useAccounts";
import { RefreshCw, TimerReset } from "lucide-react";
import { apiFetch } from "../api/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { AccountSnapshot } from "../types";

export function AccountsPage() {
  const { data, isLoading, error } = useAccounts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="nb-card p-6 h-32 animate-pulse bg-ink/5" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="nb-card p-6">
        <p className="text-red font-medium">加载失败: {error.message}</p>
      </div>
    );
  }

  if (!data) return null;

  const providers = Object.entries(data.providers);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold">Accounts</h2>

      {providers.length === 0 && (
        <div className="nb-card p-6 text-center text-ink/50">
          暂无已登录的账号
        </div>
      )}

      {providers.map(([name, provider]) => (
        <section key={name} className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold capitalize text-lg">{name}</h3>
            <span className="nb-badge-info">{provider.account_count} 个账号</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {provider.accounts.map((account) => (
              <AccountCard key={account.email} provider={name} account={account} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function AccountCard({ provider, account }: { provider: string; account: AccountSnapshot }) {
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isCoolingDown = account.cooldownUntil && account.cooldownUntil > Date.now();

  async function handleAction(action: "reset-cooldown" | "force-refresh") {
    setActionLoading(action);
    try {
      await apiFetch(`/admin/accounts/${provider}/${encodeURIComponent(account.email)}/${action}`, {
        method: "POST",
      });
      await queryClient.invalidateQueries({ queryKey: ["admin", "accounts"] });
    } catch {
      // errors handled by apiFetch
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="nb-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm truncate">{account.email}</p>
        <StatusBadge account={account} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <Stat label="请求" value={account.totalRequests} />
        <Stat label="成功" value={account.totalSuccesses} />
        <Stat label="失败" value={account.totalFailures} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <Stat label="输入 Token" value={formatToken(account.totalInputTokens)} />
        <Stat label="输出 Token" value={formatToken(account.totalOutputTokens)} />
      </div>

      {account.lastError && (
        <p className="text-xs text-red truncate" title={account.lastError}>
          {account.lastError}
        </p>
      )}

      {isCoolingDown && account.cooldownUntil && (
        <p className="text-xs text-yellow font-medium">
          Cooldown 至 {new Date(account.cooldownUntil).toLocaleTimeString("zh-CN")}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => handleAction("reset-cooldown")}
          disabled={actionLoading !== null}
          className="nb-btn-ghost text-xs py-1 px-2"
        >
          <TimerReset size={14} />
          {actionLoading === "reset-cooldown" ? "..." : "重置 Cooldown"}
        </button>
        <button
          onClick={() => handleAction("force-refresh")}
          disabled={actionLoading !== null}
          className="nb-btn-ghost text-xs py-1 px-2"
        >
          <RefreshCw size={14} />
          {actionLoading === "force-refresh" ? "..." : "刷新 Token"}
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ account }: { account: AccountSnapshot }) {
  if (account.refreshing) {
    return <span className="nb-badge-info">刷新中</span>;
  }
  if (account.cooldownUntil && account.cooldownUntil > Date.now()) {
    return <span className="nb-badge-warning">Cooldown</span>;
  }
  if (account.available) {
    return <span className="nb-badge-success">可用</span>;
  }
  return <span className="nb-badge-danger">不可用</span>;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-ink/50">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function formatToken(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
