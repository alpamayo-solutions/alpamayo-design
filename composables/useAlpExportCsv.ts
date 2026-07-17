/**
 * Export an array of objects as a CSV file download.
 */
function exportCsv(data: Record<string, any>[], filename: string) {
    if (!data.length) return;

    const firstRow = data[0];
    if (!firstRow) return;
    const keys = Object.keys(firstRow);
    const header = keys.join(',');
    const rows = data.map((row) =>
        keys
            .map((k) => {
                const val = row[k];
                if (val == null) return '';
                const str = String(val);
                return str.includes(',') || str.includes('"') || str.includes('\n')
                    ? `"${str.replace(/"/g, '""')}"`
                    : str;
            })
            .join(',')
    );

    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export function useAlpExportCsv() {
    return { exportCsv };
}
