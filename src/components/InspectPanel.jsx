const START_HTML = `<form method="POST">
  <!-- csrf здесь -->
</form>`

export function InspectPanel() {
  return <textarea defaultValue={START_HTML} spellCheck={false} />
}
