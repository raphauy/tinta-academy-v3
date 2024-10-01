import { SignIn } from "@clerk/nextjs";

type Props = {
  searchParams: {
    fallbackRedirectUrl?: string
  }
}
export default function SignInPage({ searchParams }: Props) {
  const fallbackRedirectUrl = searchParams.fallbackRedirectUrl
  return (
    <div className="mx-auto w-full max-w-md mt-10 lg:mt-20 flex items-center justify-center">
      {
        fallbackRedirectUrl ? <SignIn fallbackRedirectUrl={fallbackRedirectUrl} /> : <SignIn />
      }
    </div>
  )
}