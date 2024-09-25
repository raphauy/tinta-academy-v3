import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='py-4 bg-muted/40'>
      <div className='px-4 flex flex-col items-center justify-between gap-x-3 gap-y-1 text-center text-sm text-muted-foreground sm:flex-row'>
        <p>
          Tinta &copy;{new Date().getFullYear()}.
        </p>
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