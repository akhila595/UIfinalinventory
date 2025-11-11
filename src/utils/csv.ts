export function exportToCSV(rows: any[], columns: { title: string; dataIndex: string }[], filename: string) {
  if (!rows?.length) return;
  const headers = columns.map(c => c.title);
  const toCell = (row: any, key: string) => {
    const val = row?.[key];
    if (val === null || val === undefined) return "";
    const s = String(val).replace(/"/g, '""');
    // wrap in quotes if contains comma/newline
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const body = rows.map(r => columns.map(c => toCell(r, c.dataIndex)).join(",")).join("\n");
  const csv = [headers.join(","), body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
