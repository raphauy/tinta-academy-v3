import { checkRole } from "@/lib/roles";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import StudentSideBar from "./student-side-bar";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const { sessionClaims } = auth()

  if (!checkRole('admin') && !checkRole('student')) {
    redirect('/unauthorized')
  }
  return (
    <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] min-h-[calc(100vh-135px)]">
      <StudentSideBar />
      <div className="flex flex-col px-4 py-4">
        {children}
      </div>
    </div>
  );
}
