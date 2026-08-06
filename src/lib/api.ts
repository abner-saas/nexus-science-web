const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, data.message || data.error || "Erro na requisição");
  }
  return data as T;
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TRAINER" | "FINANCE" | "RECEPTION" | "STUDENT";
  studentId?: string | null;
};

export type Student = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  city: string | null;
  state: string | null;
  goal: string | null;
  restrictions: string | null;
  value: string | null;
  status: "Ativo" | "Pausado" | "Inadimplente" | "Cancelado";
  entryDate: string;
  renewDate: string | null;
  cancelDate: string | null;
  origin: string | null;
  priority: string | null;
  engagement: number | null;
  adherence: number | null;
  risk: number | null;
  heightCm: number | null;
  monthlyWeight: string | null;
  lastCheckin: string | null;
  lastBiofeedback: string | null;
  appAccess: boolean;
};

export const api = {
  login: (email: string, password: string) =>
    request<{ user: AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request<{ ok: boolean }>("/auth/logout", { method: "POST" }),
  me: () => request<{ user: AuthUser | null }>("/auth/me"),
  students: {
    list: (params?: { q?: string; status?: string }) => {
      const sp = new URLSearchParams();
      if (params?.q) sp.set("q", params.q);
      if (params?.status) sp.set("status", params.status);
      const qs = sp.toString();
      return request<{ data: Student[] }>(`/students${qs ? `?${qs}` : ""}`);
    },
    create: (body: Record<string, unknown>) =>
      request<{ data: Student }>("/students", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    update: (id: string, body: Record<string, unknown>) =>
      request<{ data: Student }>(`/students/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id: string) =>
      request<void>(`/students/${id}`, { method: "DELETE" }),
  },
  dashboard: {
    summary: () =>
      request<{
        data: {
          metrics: Record<string, unknown> | null;
          students: {
            active: number;
            overdue: number;
            paused: number;
            cancelled: number;
            total: number;
          };
        };
      }>("/dashboard/summary"),
    recompute: () =>
      request<{ data: unknown }>("/dashboard/recompute", { method: "POST" }),
  },
};
