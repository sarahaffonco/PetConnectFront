import '../styles/contato.css'

export default function Contato() {
  return (
    <div style={{ padding: '40px' }}>
      <h2>Entre em Contato</h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input type="text" placeholder="Seu nome" />
        <input type="email" placeholder="Seu email" />
        <textarea placeholder="Sua mensagem"></textarea>
        <button className="btn-primary">Enviar</button>
      </form>
    </div>
  )
}
