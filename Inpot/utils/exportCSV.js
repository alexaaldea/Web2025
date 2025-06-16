export function exportAsCsv(data, filename = 'data.csv') {
    let csvContent = '';

    if (Array.isArray(data[0])) {
        csvContent = data.map(row => row.join(',')).join('\n');
    } else {
        csvContent = data.join(',');
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
