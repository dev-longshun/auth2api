import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../api/client";
import { setApiKey } from "../api/client";

export function LoginPage() {
  const { login } = useAuth();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    setError("");

    setApiKey(key.trim());
    try {
      await apiFetch("/admin/accounts");
      login(key.trim());
    } catch {
      setError("API Key 无效或服务不可达");
      localStorage.removeItem("auth2api_admin_key");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="nb-card p-8 w-full max-w-md animate-fade-in-up">
        <h1 className="text-2xl font-bold mb-1">auth2api</h1>
        <p className="text-ink/60 text-sm mb-6">输入 API Key 登录管理面板</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              className="nb-input"
              placeholder="sk-..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !key.trim()}
            className="nb-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "验证中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
