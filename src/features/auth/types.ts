export type User = {
  id?: string;
  name?: string;
  email: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};
