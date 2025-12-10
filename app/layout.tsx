import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "./providers";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Org Chart",
  description: "Org chart assignment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden font-sans text-text-primary">
        <StoreProvider>
          <div className="flex h-full">
            <aside className="hidden md:flex  border-r bg-white">
              <Sidebar />
            </aside>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
