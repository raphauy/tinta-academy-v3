import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='py-4 pr-12 bg-muted/40'>
      <div className='px-4 sm:px-6 md:px-8 flex flex-col items-center justify-between gap-y-4 text-center text-sm text-muted-foreground sm:flex-row sm:gap-x-3'>
        <div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-4'>
          <div className='flex flex-wrap justify-center gap-2 sm:gap-4'>
            <Link
              href="/politicas/ajuste-razonable"
              className='hover:text-accent-foreground transition-colors'
            >
              Política de Ajustes Razonables
            </Link>
            <Link
              href="/politicas/conflicto-intereses"
              className='hover:text-accent-foreground transition-colors'
            >
              Política de Conflicto de Intereses
            </Link>
          </div>
        </div>
        <p className='text-xs'>
          Desarrollado por{' '}
          <Link
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary transition-colors hover:text-accent-foreground'
            href='https://tinta.wine/'
          >
            Tinta Software
          </Link>
        </p>
      </div>
    </footer>
  )
}