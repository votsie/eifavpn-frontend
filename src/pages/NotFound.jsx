import { Button } from '@heroui/react'
import { Link } from 'react-router-dom'
import Background from '../components/Background'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <Background />
      <div className="relative z-10 text-center">
        <h1 className="font-heading text-8xl font-extrabold text-accent">404</h1>
        <p className="mt-4 text-lg text-muted">Страница не найдена</p>
        <div className="mt-8 flex gap-4">
          <Button as={Link} to="/" variant="outline">На главную</Button>
          <Button as={Link} to="/cabinet">В кабинет</Button>
        </div>
      </div>
    </div>
  )
}
