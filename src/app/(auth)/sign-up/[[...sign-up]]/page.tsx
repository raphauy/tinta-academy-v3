import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
      <div className="mx-auto w-full max-w-md mt-10 lg:mt-20 flex items-center justify-center">
        <SignUp />
      </div>
    )
}