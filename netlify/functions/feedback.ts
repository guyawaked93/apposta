
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
  if (/https?:\/\//.test(t)) return true
  return BAD_WORDS.some(w => t.includes(w))
}

const DEFAULT_TO = 'inceptionsolutions24@gmail.com'

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  try {
    const body: Payload = JSON.parse(event.body || '{}')
    if (body.hp) return { statusCode: 400, body: 'Bad Request' }
    if (!body.title || body.title.trim().length < 5 || body.title.length > 100) return { statusCode: 400, body: 'Invalid title' }
    if (!body.description || body.description.trim().length < 10 || body.description.length > 2000) return { statusCode: 400, body: 'Invalid description' }
    if (hasMalicious(body.title) || hasMalicious(body.description) || hasMalicious(body.contact || '')) return { statusCode: 400, body: 'Blocked by security policy' }

    const ip = event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || 'unknown'
    const ua = event.headers['user-agent'] || 'unknown'
    const when = new Date().toISOString()

    const text = `Tipo: ${body.kind}\nTítulo: ${body.title}\nDescrição:\n${body.description}\nContato: ${body.contact || '-'}\nIP: ${ip}\nUA: ${ua}\nData: ${when}`

    const to = process.env.FEEDBACK_TO || DEFAULT_TO
    const resendKey = process.env.RESEND_API_KEY
    const smtpUrl = process.env.SMTP_URL

    if (resendKey) {
      // Try sending via Resend API (no extra deps). From must be verified or onboarding@resend.dev
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Aposta <onboarding@resend.dev>',
            to: [to],
            subject: `Feedback (${body.kind}) - ${body.title}`,
            text,
          }),
        })
        if (!res.ok) {
          const t = await res.text().catch(() => '')
          console.error('Resend failed', res.status, t)
        }
      } catch (e) {
        console.error('Resend error', e)
      }
    } else if (smtpUrl && to) {
      // SMTP available but nodemailer not implemented; log fallback
      console.log('Feedback (SMTP configured but not implemented here):', { to, preview: text.slice(0, 200) + '…' })
    } else {
      console.log('Feedback (log only):', text)
    }

    return { statusCode: 200, body: 'ok' }
  } catch (e) {
    console.error(e)
    return { statusCode: 500, body: 'Server error' }
  }
}
