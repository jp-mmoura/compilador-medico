// frontend/src/pages/Registro.tsx
import { useState } from 'react'
import axios from 'axios'

export function Registro() {
  const [texto, setTexto] = useState("")

  const enviar = async () => {
    const response = await axios.post("http://localhost:8000/api/compilador", {
      texto
    })
    alert(response.data.mensagem)
  }

  return (
    <div>
      <h1>Registro via Prontuário</h1>
      <textarea value={texto} onChange={(e) => setTexto(e.target.value)} />
      <button onClick={enviar}>Enviar</button>
    </div>
  )
}
