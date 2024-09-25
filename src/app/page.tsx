import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Dashboard() {

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl text-foreground mt-11">
      <h1 className="text-4xl font-semibold text-center text-tinta-verde mb-8 dark:text-white">Tu Pasaporte a la Cultura del Vino</h1>
      <p className="container text-center text-lg mb-8">
        Tinta Academy es un centro de formación especializado en la educación sobre vinos donde vas a descubrir, enriquecer y elevar tu conocimiento sobre la cultura del vino con una perspectiva global.
      </p>
      <p className="container text-center text-lg mb-8">
        Creemos en el poder transformador del conocimiento y ofrecemos una educación de excelencia que combina teoría, práctica y experiencia, permitiéndote vivir y apreciar la cultura del vino de una manera única.
      </p>

      <div className="flex items-center justify-center gap-8 mt-32 ml-5">
        <div>
          <Image src="/WSET_N.png" alt="WSET" width={300} height={100} className="dark:hidden"/>
          <Image src="/WSET_B.png" alt="WSET" width={300} height={100} className="hidden dark:block"/>
        </div>
        <p className="text-lg">
          Primera y única Approved Programme Provider WSET en Uruguay
        </p>
      </div>

      <div className="mt-20">
        <Link href="/cursos" className="flex justify-center">
          <Button>
            Ver cursos
          </Button>
      </Link>
      </div>

    </main>
  )
}
