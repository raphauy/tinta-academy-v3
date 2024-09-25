import { SignIn } from "@clerk/nextjs";


export default function SignInPage() {
  return (
    <div className="mx-auto w-full max-w-md mt-10 lg:mt-20 flex items-center justify-center">
      <SignIn />
    </div>
  )
}