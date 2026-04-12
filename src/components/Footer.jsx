
export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/30 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="EIFAVPN" className="h-6 w-6 object-contain" />
            <span className="font-heading text-lg font-bold text-foreground">
              EIFAVPN
            </span>
          </div>
          <div className="flex gap-8 text-sm text-muted">
            <a href="#" className="transition-colors hover:text-foreground">Политика</a>
            <a href="#" className="transition-colors hover:text-foreground">Условия</a>
            <a href="#" className="transition-colors hover:text-foreground">Контакты</a>
          </div>
          <p className="text-xs text-muted/60">
            &copy; 2026 EIFAVPN. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
