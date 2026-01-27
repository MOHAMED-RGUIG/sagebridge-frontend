import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const metadata: Metadata = {
  title: "SageBridge",
  description:
    "SageBridge | Gestion Achats, Sinistres & Stock , Devis",};
    
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} min-h-screen bg-bg font-sans text-text`}>        
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
