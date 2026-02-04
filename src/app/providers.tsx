"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { authActions } from "@/features/auth/authSlice";

function BootstrapAuth() {
  useEffect(() => {
    const token = localStorage.getItem("sb_token");
    if (token) {
      store.dispatch(authActions.loginSuccess({ token, user: { userName: "saved@user.com" } }));
    }
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
      <BootstrapAuth />
    {children}</Provider>;
}
