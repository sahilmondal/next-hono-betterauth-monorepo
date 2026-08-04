import { auth } from "../lib/auth";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | object;
  code?: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface HonoContext {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}
