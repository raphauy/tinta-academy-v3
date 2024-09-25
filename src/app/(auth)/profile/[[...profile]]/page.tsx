import { UserProfile } from "@clerk/nextjs";

export default async function ProfilePage() {

    return (
        <div className="flex items-center justify-center mt-10">
            <UserProfile />
        </div>
    )
}