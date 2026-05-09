import { useState } from "react";
import { apiFetch } from "../../api/client";
import { useQueryClient } from "@tanstack/react-query";
import { UserPlus, ExternalLink, Loader2, CheckCircle, XCircle } from "lucide-react";

const PROVIDERS = [
  { id: "anthropic", label: "Claude (Anthropic)" },
  { id: "codex", label: "ChatGPT (Codex)" },
  { id: "cursor", label: "Cursor (实验性)" },
];

type LoginStatus = "idle" | "waiting" | "success" | "error";

export function AddAccountDialog() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [authUrl, setAuthUrl] = useState("");
  const [resultEmail, setResultEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const queryClient = useQueryClient();

  function reset() {
    setStatus("idle");
    setAuthUrl("");
    setResultEmail("");
    setErrorMsg("");
  }

  function handleClose() {
    setOpen(false);
    reset();
  }

  async function startLogin(providerId: string) {
    reset();
    setStatus("waiting");
    try {
      const res = await apiFetch<{ sessionId: string; authUrl: string }>(
        `/admin/login/${providerId}`,
        { method: "POST" }
      );
      setAuthUrl(res.authUrl);
      window.open(res.authUrl, "_blank");
      pollStatus(res.sessionId);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "启动登录失败");
    }
  }

  async function pollStatus(sid: string) {
    const maxAttempts = 150;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const res = await apiFetch<{
          status: string;
          email?: string;
          error?: string;
        }>(`/admin/login/${sid}/status`);

        if (res.status === "success") {
          setStatus("success");
          setResultEmail(res.email || "");
          queryClient.invalidateQueries({ queryKey: ["admin", "accounts"] });
          return;
        }
        if (res.status === "error") {
          setStatus("error");
          setErrorMsg(res.error || "登录失败");
          return;
        }
      } catch {
        // keep polling
      }
    }
    setStatus("error");
    setErrorMsg("登录超时");
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="nb-btn-primary">
        <UserPlus size={16} />
        添加账号
      </button>
    );
  }

  return (
    <div className="nb-card p-5 space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">添加账号</h3>
        <button onClick={handleClose} className="nb-btn-ghost text-xs py-1 px-2">
          关闭
        </button>
      </div>

      {status === "idle" && (
        <div className="space-y-2">
          <p className="text-sm text-ink/60">选择 Provider 开始 OAuth 授权：</p>
          <div className="flex flex-wrap gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => startLogin(p.id)}
                className="nb-btn-secondary text-sm"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {status === "waiting" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" />
            <span>等待浏览器授权完成...</span>
          </div>
          {authUrl && (
            <div className="space-y-1">
              <p className="text-xs text-ink/50">如果浏览器没有自动打开，请手动访问：</p>
              <a
                href={authUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue underline break-all flex items-center gap-1"
              >
                <ExternalLink size={12} />
                打开授权页面
              </a>
            </div>
          )}
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-2 text-green">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">登录成功：{resultEmail}</span>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red">
            <XCircle size={18} />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
          <button onClick={reset} className="nb-btn-ghost text-xs">
            重试
          </button>
        </div>
      )}
    </div>
  );
}
