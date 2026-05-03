export default function StandingsTable({ standings, participants }) {
  const sorted = standings.slice().sort((a, b) => b.wins - a.wins || a.losses - b.losses);

  return (
    <div className="card standings">
      <h3>Таблица</h3>
      <table>
        <thead>
          <tr>
            <th>Участник</th>
            <th>Победы</th>
            <th>Поражения</th>
            <th>Сыграно</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const participant = participants.find((p) => p.id === row.participantId);
            return (
              <tr key={row.participantId}>
                <td>{participant?.name ?? row.participantId}</td>
                <td>{row.wins}</td>
                <td>{row.losses}</td>
                <td>{row.played}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
