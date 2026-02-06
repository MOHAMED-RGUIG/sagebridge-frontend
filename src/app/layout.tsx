import type { Metadata } from "next";
import { Inter ,Poppins, Plus_Jakarta_Sans, DM_Sans,Montserrat  } from "next/font/google";


import "./globals.css";
import Providers from "./providers";


const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});


export const metadata: Metadata = {
  title: "SageBridge",
  description:
    "SageBridge | Gestion Achats, Sinistres & Stock , Devis",};
    
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
<body className={`${jakarta.variable} min-h-screen bg-bg font-sans text-text`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
