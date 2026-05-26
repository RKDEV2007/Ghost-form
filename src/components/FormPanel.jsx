export function FormPanel() {
  return (
    <form>
      <label>name<input placeholder="ADMIN_main_404" /></label>
      <label>message<input placeholder="текст сообщения" /></label>
      <button type="button" className="btn primary">send</button>
    </form>
  )
}
