import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner, Input, Chip, Button } from '@heroui/react'
import { Magnifier } from '@gravity-ui/icons'
import { getAdminUsers } from '../../api/admin'

const planFilters = ['All', 'Standard', 'Pro', 'Max', 'None']
const planLabels = { All: 'Все', Standard: 'Standard', Pro: 'Pro', Max: 'Max', None: 'Нет' }
const statusFilters = ['All', 'Active', 'Expired', 'Trial', 'Never']
const statusLabels = { All: 'Все', Active: 'Active', Expired: 'Expired', Trial: 'Trial', Never: 'Never' }

export default function Users() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceRef = useRef(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page }
      if (debouncedSearch) params.search = debouncedSearch
      if (planFilter !== 'All') params.plan = planFilter.toLowerCase()
      if (statusFilter !== 'All') params.status = statusFilter.toLowerCase()

      const data = await getAdminUsers(params)
      if (data && typeof data === 'object') {
        setUsers(data.results ?? data.users ?? [])
        setTotalPages(data.total_pages ?? (Math.ceil((data.count ?? 0) / 20) || 1))
        setTotal(data.count ?? (data.results ?? data.users ?? []).length)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, planFilter, statusFilter, page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  function handleSearch(e) {
    const val = e.target.value
    setSearch(val)
    setPage(1)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 300)
  }

  function statusColor(status) {
    switch (status?.toLowerCase()) {
      case 'active': return 'success'
      case 'expired': return 'danger'
      case 'trial': return 'warning'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-xl font-bold text-foreground">Пользователи</h1>

      {/* Search */}
      <Input
        placeholder="Поиск по email или имени..."
        value={search}
        onChange={handleSearch}
        startContent={<Magnifier className="h-4 w-4 text-muted" />}
        classNames={{ inputWrapper: 'bg-surface border border-border' }}
      />

      {/* Plan filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-1">План:</span>
        {planFilters.map((f) => (
          <Chip
            key={f}
            variant={planFilter === f ? 'solid' : 'bordered'}
            color={planFilter === f ? 'primary' : 'default'}
            className="cursor-pointer text-xs"
            onClick={() => { setPlanFilter(f); setPage(1) }}
          >
            {planLabels[f] || f}
          </Chip>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted self-center mr-1">Статус:</span>
        {statusFilters.map((f) => (
          <Chip
            key={f}
            variant={statusFilter === f ? 'solid' : 'bordered'}
            color={statusFilter === f ? 'primary' : 'default'}
            className="cursor-pointer text-xs"
            onClick={() => { setStatusFilter(f); setPage(1) }}
          >
            {statusLabels[f] || f}
          </Chip>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Total count */}
      {!loading && <p className="text-xs text-muted">{total} пользователей</p>}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="px-4 pb-2 pt-3 font-medium">Email</th>
                <th className="px-4 pb-2 pt-3 font-medium">Имя</th>
                <th className="px-4 pb-2 pt-3 font-medium">Telegram</th>
                <th className="px-4 pb-2 pt-3 font-medium">План</th>
                <th className="px-4 pb-2 pt-3 font-medium">Статус</th>
                <th className="px-4 pb-2 pt-3 font-medium">Дней</th>
                <th className="px-4 pb-2 pt-3 font-medium">Дата рег.</th>
                <th className="px-4 pb-2 pt-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted">
                    Пользователи не найдены
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border/50 hover:bg-surface/50 cursor-pointer"
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <td className="px-4 py-3 text-foreground">{user.email}</td>
                    <td className="px-4 py-3 text-foreground">{user.name || '—'}</td>
                    <td className="px-4 py-3 text-muted text-xs">{user.telegram_id || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-muted">{user.plan || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Chip size="sm" color={statusColor(user.status)} variant="flat">
                        {user.status || '—'}
                      </Chip>
                    </td>
                    <td className="px-4 py-3 text-foreground">{user.days_left ?? '—'}</td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {user.registered_at ? new Date(user.registered_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/admin/users/${user.id}`)
                        }}
                      >
                        Открыть
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            size="sm"
            variant="flat"
            isDisabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Назад
          </Button>
          <span className="text-sm text-muted">
            Стр. {page} из {totalPages}
          </span>
          <Button
            size="sm"
            variant="flat"
            isDisabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Далее
          </Button>
        </div>
      )}
    </div>
  )
}
