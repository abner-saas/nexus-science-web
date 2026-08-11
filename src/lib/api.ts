const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...((init?.headers as Record<string, string>) ?? {}),
  };
  // Só envia JSON content-type quando há body — Fastify rejeita body vazio com application/json
  if (init?.body !== undefined && headers["Content-Type"] === undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
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
  planId?: string | null;
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
  trainerId?: string | null;
};

export type Plan = {
  id: string;
  name: string;
  tier: string;
  value: string;
  benefits: string[] | null;
  checkoutUrl: string | null;
  active: boolean;
  activeStudents?: number;
};

export type Routine = {
  id: string;
  studentId: string;
  studentName?: string | null;
  name: string;
  objective: string | null;
  frequency: number;
  status: string;
  totalSessions: number | null;
  completedSessions: number | null;
  trainings: Array<{
    id: string;
    code: string;
    name: string;
    focus: string | null;
    dayOfWeek: string | null;
    duration: string | null;
    exercises: Array<{
      name: string;
      group: string;
      sets: number;
      reps: string;
      load?: number;
      rest?: string;
    }>;
  }>;
};

export type BioEntry = {
  id: string;
  date: string;
  energy: number | null;
  mood: number | null;
  stress: number | null;
  sleep: number | null;
  sleepHours: string | null;
  hydration: string | null;
  musclePain: number | null;
  weight: string | null;
  aiInsight: string | null;
};

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: AuthUser["role"];
  active: boolean;
  studentId: string | null;
  createdAt: string;
  matrix?: {
    label: string;
    description: string;
    modules: readonly string[];
  };
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
    get: (id: string) => request<{ data: Student }>(`/students/${id}`),
    create: (body: Record<string, unknown>) =>
      request<{ data: Student }>("/students", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Record<string, unknown>) =>
      request<{ data: Student }>(`/students/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id: string) => request<void>(`/students/${id}`, { method: "DELETE" }),
  },

  plans: {
    list: () => request<{ data: Plan[] }>("/plans"),
    create: (body: Record<string, unknown>) =>
      request<{ data: Plan }>("/plans", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Record<string, unknown>) =>
      request<{ data: Plan }>(`/plans/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    remove: (id: string) => request<void>(`/plans/${id}`, { method: "DELETE" }),
  },

  routines: {
    list: (studentId?: string) =>
      request<{ data: Routine[] }>(`/routines${studentId ? `?studentId=${studentId}` : ""}`),
    create: (body: Record<string, unknown>) =>
      request<{ data: Routine }>("/routines", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Record<string, unknown>) =>
      request<{ data: Routine }>(`/routines/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    addTraining: (routineId: string, body: Record<string, unknown>) =>
      request<{ data: Routine["trainings"][number] }>(`/routines/${routineId}/trainings`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    updateTraining: (id: string, body: Record<string, unknown>) =>
      request<{ data: Routine["trainings"][number] }>(`/trainings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    remove: (id: string) => request<void>(`/routines/${id}`, { method: "DELETE" }),
  },

  sessions: {
    create: (body: Record<string, unknown>) =>
      request<{ data: unknown }>("/sessions", { method: "POST", body: JSON.stringify(body) }),
  },

  biofeedback: {
    list: (studentId: string, days = 30) =>
      request<{ data: BioEntry[] }>(`/biofeedback?studentId=${studentId}&days=${days}`),
    create: (body: Record<string, unknown>) =>
      request<{ data: BioEntry }>("/biofeedback", { method: "POST", body: JSON.stringify(body) }),
    insight: (studentId: string) =>
      request<{ data: { insight: string; daysAnalyzed: number } }>("/biofeedback/insight", {
        method: "POST",
        body: JSON.stringify({ studentId }),
      }),
  },

  finance: {
    summary: () =>
      request<{
        data: {
          revenue: number;
          expenses: number;
          profit: number;
          margin: number;
          mrr: number;
          arr: number;
          series: Array<{ month: string; revenue: number; expenses: number; profit: number }>;
        };
      }>("/finance/summary"),
    transactions: () =>
      request<{
        data: Array<{
          id: string;
          type: string;
          category: string;
          description: string | null;
          amount: string;
          date: string;
        }>;
      }>("/finance/transactions"),
    createTx: (body: Record<string, unknown>) =>
      request<{ data: unknown }>("/finance/transactions", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },

  payments: {
    list: (studentId?: string) =>
      request<{
        data: Array<{
          id: string;
          studentId: string;
          amount: string;
          method: string | null;
          status: string;
          dueDate: string;
          checkoutUrl: string | null;
        }>;
      }>(`/payments${studentId ? `?studentId=${studentId}` : ""}`),
    create: (body: Record<string, unknown>) =>
      request<{ data: unknown }>("/payments", { method: "POST", body: JSON.stringify(body) }),
  },

  assessments: {
    list: (studentId: string) =>
      request<{
        data: Array<{
          id: string;
          date: string;
          weight: string | null;
          heightCm: number | null;
          bmi: string | null;
          bodyFat: string | null;
          muscle: string | null;
          waist: string | null;
        }>;
      }>(`/assessments?studentId=${studentId}`),
    create: (body: Record<string, unknown>) =>
      request<{ data: unknown }>("/assessments", { method: "POST", body: JSON.stringify(body) }),
  },

  retention: {
    get: () =>
      request<{
        data: {
          retentionRate: number;
          churnRate: number;
          avgLtv: number;
          revenueAtRisk: number;
          atRisk: Array<{
            id: string;
            name: string;
            status: string;
            score: number;
            reasons: string[];
            action: string;
          }>;
        };
      }>("/retention"),
  },

  ai: {
    insights: () =>
      request<{
        data: {
          insights: Array<{ type: string; title: string; body: string; priority: string }>;
          executiveSummary: string;
        };
      }>("/ai/insights"),
  },

  users: {
    list: () => request<{ data: StaffUser[] }>("/users"),
    roles: () =>
      request<{
        data: Array<{
          role: string;
          label: string;
          description: string;
          modules: string[];
        }>;
      }>("/users/roles"),
    create: (body: Record<string, unknown>) =>
      request<{ data: StaffUser }>("/users", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Record<string, unknown>) =>
      request<{ data: StaffUser }>(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    createStudentAccess: (body: Record<string, unknown>) =>
      request<{ data: StaffUser }>("/users/student-access", {
        method: "POST",
        body: JSON.stringify(body),
      }),
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
            atRisk?: number;
            noBio7d?: number;
            absent14d?: number;
            mrr?: string;
            avgTicket?: string;
          };
          alerts?: Array<{
            id: string;
            name: string;
            message: string;
            status: string;
          }>;
        };
      }>("/dashboard/summary"),
    recompute: () => request<{ data: unknown }>("/dashboard/recompute", { method: "POST" }),
  },
};
