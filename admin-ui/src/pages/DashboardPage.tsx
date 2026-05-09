import { useAccounts } from "../hooks/useAccounts";
import { Activity, Users, Zap, AlertTriangle } from "lucide-react";

export function DashboardPage() {
  const { data, isLoading, error } = useAccounts();

  if (isLoading) {
    return <LoadingSkeleton />;
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

  const totalAccounts = providers.reduce((sum, [, p]) => sum + p.account_count, 0);
  const availableAccounts = providers.reduce(
    (sum, [, p]) => sum + p.accounts.filter((a) => a.available).length,
    0
  );
  const totalRequests = providers.reduce(
    (sum, [, p]) => sum + p.accounts.reduce((s, a) => s + a.totalRequests, 0),
    0
  );
  const totalTokens = providers.reduce(
    (sum, [, p]) =>
      sum + p.accounts.reduce((s, a) => s + a.totalInputTokens + a.totalOutputTokens, 0),
    0
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={20} />}
          label="总账号"
          value={totalAccounts}
          color="bg-blue"
        />
        <StatCard
          icon={<Activity size={20} />}
          label="可用"
          value={availableAccounts}
          color="bg-green"
        />
        <StatCard
          icon={<Zap size={20} />}
          label="总请求"
          value={formatNumber(totalRequests)}
          color="bg-orange"
        />
        <StatCard
          icon={<AlertTriangle size={20} />}
          label="总 Token"
          value={formatNumber(totalTokens)}
          color="bg-yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {providers.map(([name, provider]) => (
          <ProviderCard key={name} name={name} provider={provider} />
        ))}
      </div>

      <p className="text-xs text-ink/40">
        数据更新于 {new Date(data.generated_at).toLocaleString("zh-CN")} · 每 10 秒自动刷新
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="nb-card p-4 flex items-center gap-3">
      <div className={`${color} text-cream p-2 rounded-brutal border-brutal border-ink`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-ink/60 font-medium">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

function ProviderCard({
  name,
  provider,
}: {
  name: string;
  provider: { accounts: { available: boolean; totalRequests: number; totalSuccesses: number; totalFailures: number }[]; account_count: number };
}) {
  const available = provider.accounts.filter((a) => a.available).length;
  const requests = provider.accounts.reduce((s, a) => s + a.totalRequests, 0);
  const failures = provider.accounts.reduce((s, a) => s + a.totalFailures, 0);

  return (
    <div className="nb-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold capitalize">{name}</h3>
        <span className={available > 0 ? "nb-badge-success" : "nb-badge-danger"}>
          {available}/{provider.account_count}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-ink/50 text-xs">请求</p>
          <p className="font-semibold">{formatNumber(requests)}</p>
        </div>
        <div>
          <p className="text-ink/50 text-xs">失败</p>
          <p className="font-semibold text-red">{formatNumber(failures)}</p>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-32 bg-ink/10 rounded-brutal animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="nb-card p-4 h-20 animate-pulse bg-ink/5" />
        ))}
      </div>
    </div>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
