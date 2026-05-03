export default function ParticipantsEditor({
  participants,
  onAdd,
  onUpdate,
  onRemove,
  onGenerate,
}) {
  return (
    <section className="card section">
      <h2>Участники</h2>
      <p className="muted">Управление списком. После изменений при необходимости пересоздайте сетку.</p>
      <ul className="participant-editor">
        {participants.map((p) => (
          <li key={p.id}>
            <input value={p.name} placeholder="Имя участника" onChange={(e) => onUpdate(p.id, e.target.value)} />
            <button type="button" className="btn ghost danger" onClick={() => onRemove(p.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn secondary" onClick={onAdd}>
        Добавить участника
      </button>
      <div className="section-actions">
        <button type="button" className="btn primary" onClick={onGenerate}>
          Сгенерировать сетку
        </button>
      </div>
    </section>
  );
}
