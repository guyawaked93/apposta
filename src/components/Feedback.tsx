import React, { useState } from 'react'

type Kind = 'bug' | 'sugestao'

interface Payload {
  kind: Kind
  title: string
  description: string
  contact?: string
  hp?: string
}

const BAD_WORDS = ['script', '<', '>', 'onerror', 'onload']

function hasMalicious(text: string) {
  if (!text) return false
  const t = text.toLowerCase()
  if (/<[^>]+>/.test(t)) return true
  if (/(javascript:|data:text\/html|onerror\=|onload\=)/.test(t)) return true
  if (/https?:\/\//.test(t)) return true // evita links diretos
  return BAD_WORDS.some(w => t.includes(w))
}

export default function Feedback() {
  const [kind, setKind] = useState<Kind>('bug')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')
  const [hp, setHp] = useState('') // honeypot
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'error'>('idle')
  const [msg, setMsg] = useState<string>('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')

    // validações básicas
    if (!title || title.trim().length < 5 || title.length > 100) { setMsg('Título deve ter entre 5 e 100 caracteres.'); return }
    if (!description || description.trim().length < 10 || description.length > 2000) { setMsg('Descrição deve ter entre 10 e 2000 caracteres.'); return }
    if (hasMalicious(title) || hasMalicious(description) || hasMalicious(contact)) { setMsg('Conteúdo bloqueado por segurança. Remova HTML, scripts e links.'); return }
    if (hp) { setMsg('Erro no envio.'); return }

    const payload: Payload = { kind, title: title.trim(), description: description.trim(), contact: contact.trim() || undefined, hp: hp || undefined }

    try {
      setStatus('sending')
      const res = await fetch('/.netlify/functions/feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus('ok')
      setMsg('Obrigado! Sua mensagem foi enviada com sucesso.')
      setTitle(''); setDescription(''); setContact('')
    } catch (err: any) {
      setStatus('error')
      setMsg('Não foi possível enviar agora. Tente novamente mais tarde.')
    }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Sugestões e Bugs</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Envie uma sugestão de melhoria ou relate um bug. Seu e-mail não será exibido. Opcionalmente, deixe um contato caso queira retorno.</p>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Tipo</label>
          <select className="input" value={kind} onChange={e => setKind(e.target.value as Kind)}>
            <option value="bug">Bug</option>
            <option value="sugestao">Sugestão</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Título</label>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Resumo curto" maxLength={100} required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Descrição</label>
          <textarea className="input min-h-[120px]" value={description} onChange={e => setDescription(e.target.value)} placeholder="Explique o que aconteceu ou sua ideia" maxLength={2000} required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Contato (opcional)</label>
          <input className="input" value={contact} onChange={e => setContact(e.target.value)} placeholder="Seu e-mail ou @usuário" maxLength={120} />
        </div>
        {/* honeypot */}
        <input className="hidden" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} aria-hidden="true" />

        <div className="flex items-center gap-2">
          <button className="btn" disabled={status === 'sending'} type="submit">{status === 'sending' ? 'Enviando…' : 'Enviar'}</button>
          {msg && (<span className={`text-sm ${status === 'ok' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>{msg}</span>)}
        </div>
      </form>
    </div>
  )
}
