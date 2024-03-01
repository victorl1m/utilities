import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "l1ma/utilities",
  description: "Utilities platform for everyday use",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
