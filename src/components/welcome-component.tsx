import { Button } from "@/components/ui/button"
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"

export function WelcomeComponent() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 font-['Inter',sans-serif]">
      <div className="text-center space-y-8 p-10 bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-2xl w-full">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Bienvenido a Tinta Academy
        </h1>
        <p className="text-xl text-muted-foreground font-light leading-relaxed">
        Tinta Academy es un centro de formación especializado en la educación sobre vinos donde vas a descubrir, enriquecer y elevar tu conocimiento sobre la cultura del vino con una perspectiva global.
        </p>
          <SignedOut>
            <div className="flex items-center justify-center gap-4">
              <SignInButton>
                <Button size="lg" className="w-full text-lg py-6 rounded-xl transition-all hover:shadow-lg hover:scale-105">
                    Iniciar Sesión
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button size="lg" className="w-full text-lg py-6 rounded-xl transition-all hover:shadow-lg hover:scale-105">
                    Registrarme
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
      </div>
    </div>
  )
}