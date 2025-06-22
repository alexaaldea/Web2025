export function exportAsJson(data, filename = 'data.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function parseTextOutputToArray(text) {
    const lines = text.trim().split('\n');
    const data = lines.map(line => line.trim().split(/\s+/).map(Number));
    return data.length === 1 ? data[0] : data;
}

export function parseTextOutputToArrayMatrix(text) {
    const lines = text.trim().split('\n');
    const data = lines.map(line =>
        line.trim().split(',').map(num => {
            const parsed = Number(num.trim());
            return isNaN(parsed) ? null : parsed;
        })
    );
    return data.length === 1 ? data[0] : data;
}
