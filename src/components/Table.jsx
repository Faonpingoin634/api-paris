
export default function Table({ columns, rows, loading }) {
  if (loading) {
    return <p className="loading">Chargement...</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length}>Aucune donnée</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
