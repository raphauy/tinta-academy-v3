import type { Metadata } from "next";
import Header from "./header";
import SideBar from "./side-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <Header />
        {children}
      </div>
    </div>
  );
}
