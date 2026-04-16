import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
          <img src="/logo.png" alt="EIFAVPN" className="mb-6 h-16 w-16 object-contain" />
          <h1 className="font-heading text-2xl font-bold text-foreground">Что-то пошло не так</h1>
          <p className="mt-3 max-w-md text-sm text-muted">
            Произошла непредвиденная ошибка. Попробуйте обновить страницу.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Обновить страницу
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
