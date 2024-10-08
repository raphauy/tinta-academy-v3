import type { Metadata } from "next";
import AdminSideBar from "./admin-side-bar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkRole } from "@/lib/roles";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const { sessionClaims } = auth()

  if (!checkRole('admin')) {
    redirect('/unauthorized')
  }
  return (
    <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] min-h-[calc(100vh-135px)]">
      <AdminSideBar />
      <div className="flex flex-col px-4 py-4">
        {children}
      </div>
    </div>
  );
}
