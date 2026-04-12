
export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.04] px-5 py-10 md:px-6 md:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
          <a href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <img src="/logo.png" alt="EIFAVPN" className="h-6 w-6 object-contain" />
            <span className="font-heading text-[15px] font-bold text-foreground">EIFAVPN</span>
          </a>
          <div className="flex gap-6 text-[13px] text-muted/70">
            <a href="/terms" className="transition-colors hover:text-foreground">Политика</a>
            <a href="/terms" className="transition-colors hover:text-foreground">Условия</a>
            <a href="mailto:support@eifavpn.ru" className="transition-colors hover:text-foreground">Поддержка</a>
          </div>
          <p className="text-[11px] text-muted/40">
            &copy; 2026 EIFAVPN
          </p>
        </div>
      </div>
    </footer>
  )
}
