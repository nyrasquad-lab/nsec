export const EDGE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`

export async function callEdgeFunction(name: string, body: unknown, sessionToken?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (sessionToken) {
    headers['X-Admin-Token'] = sessionToken
  }

  const response = await fetch(`${EDGE_FUNCTION_URL}/${name}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: `Request failed (${response.status})` }))
    throw new Error(errorBody.error || `Request failed (${response.status})`)
  }

  return response.json()
}

export async function getEdgeFunction(name: string, sessionToken?: string) {
  const headers: Record<string, string> = {}

  if (sessionToken) {
    headers['X-Admin-Token'] = sessionToken
  }

  const response = await fetch(`${EDGE_FUNCTION_URL}/${name}`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: `Request failed (${response.status})` }))
    throw new Error(errorBody.error || `Request failed (${response.status})`)
  }

  return response.json()
}
