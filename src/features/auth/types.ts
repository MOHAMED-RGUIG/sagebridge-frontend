export type User = {
  id?: string;
  name?: string;
  usr0?: string; 
    site?: string;  
  userName: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};
