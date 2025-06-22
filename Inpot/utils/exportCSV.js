export function exportAsCsv(data, filename = 'data.csv') {
    let csvContent = '';

    if (Array.isArray(data[0])) {
        csvContent = data.map(row => row.join(' ')).join('\n');
    } else {
         csvContent = data.join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function exportAsCsv2(data, filename = 'data.csv') {
    let csvContent = '';

    if (Array.isArray(data)) {
        if (data.length === 0) {
            csvContent = ''; 
        } else if (Array.isArray(data[0])) {
            csvContent = data.map(row => {
                if (Array.isArray(row)) {
                    return row.join(',');
                } else {
                    return String(row);
                }
            }).join('\n');
        } else if (typeof data[0] === 'string' || typeof data[0] === 'number') {
            csvContent = data.join('\n');
        } else {
            csvContent = JSON.stringify(data);
        }
    } else {
        csvContent = String(data);
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}
