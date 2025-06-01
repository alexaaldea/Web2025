export function createGraphSVG(graphData) {
    function svgFromMatrix(matrix) {
        const n = matrix.length;
        const width = 500, height = 500;
        const centerX = width / 2, centerY = height / 2;
        const layoutRadius = Math.min(width, height) / 2 - 50;
        const nodeRadius = 10;
        const positions = [];
        for (let i = 0; i < n; i++) {
            const angle = (2 * Math.PI * i) / n;
            positions.push({
                x: centerX + layoutRadius * Math.cos(angle),
                y: centerY + layoutRadius * Math.sin(angle)
            });
        }

        const directed = window.currentGraphOriented === true;
        const markerDef = directed ? 'marker-end="url(#arrow)"' : '';

        let edgesSVG = '';
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (matrix[i][j] !== 0) {
                    const weight = matrix[i][j];
                    const from = positions[i];
                    const to = positions[j];
                    const midX = (from.x + to.x) / 2;
                    const midY = (from.y + to.y) / 2;
                    edgesSVG += `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="black" stroke-width="1" ${markerDef}/>`;
                    edgesSVG += `<text x="${midX}" y="${midY - 5}" font-size="10" fill="red" text-anchor="middle">${weight}</text>`;
                }
            }
        }

        let nodesSVG = '';
        for (let i = 0; i < n; i++) {
            const pos = positions[i];
            nodesSVG += `<circle cx="${pos.x}" cy="${pos.y}" r="${nodeRadius}" fill="lightblue" stroke="black"/>`;
            nodesSVG += `<text x="${pos.x}" y="${pos.y}" font-size="12" text-anchor="middle" dominant-baseline="middle">${i + 1}</text>`;
        }

        const arrowMarker = directed ? `
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>
    </marker>
  </defs>` : '';

        return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
${arrowMarker}
${edgesSVG}
${nodesSVG}
</svg>`;
    }

    if (typeof graphData === 'string') {
        const trimmed = graphData.trim();
        const lines = trimmed.split('\n').filter(line => line.trim().length > 0);
        const isEdgeList = lines.every(line => {
            const tokens = line.trim().split(/\s+/);
            return tokens.length === 2 || tokens.length === 3;
        });

        if (isEdgeList) {
            const edges = lines.map(line => {
                const [from, to, w] = line.trim().split(/\s+/).map(Number);
                return { from, to, weight: w || 1 };
            });

            const n = Math.max(...edges.flatMap(e => [e.from, e.to]));
            const width = 500, height = 500;
            const centerX = width / 2, centerY = height / 2;
            const layoutRadius = Math.min(width, height) / 2 - 50;
            const nodeRadius = 10;
            const positions = [];
            for (let i = 0; i < n; i++) {
                const angle = (2 * Math.PI * i) / n;
                positions.push({
                    x: centerX + layoutRadius * Math.cos(angle),
                    y: centerY + layoutRadius * Math.sin(angle)
                });
            }

            const directed = window.currentGraphOriented === true;
            const markerDef = directed ? 'marker-end="url(#arrow)"' : '';

            let edgesSVG = '';
            for (const edge of edges) {
                const fromPos = positions[edge.from - 1];
                const toPos = positions[edge.to - 1];
                const midX = (fromPos.x + toPos.x) / 2;
                const midY = (fromPos.y + toPos.y) / 2;
                edgesSVG += `<line x1="${fromPos.x}" y1="${fromPos.y}" x2="${toPos.x}" y2="${toPos.y}" stroke="black" stroke-width="1" ${markerDef}/>`;
                edgesSVG += `<text x="${midX}" y="${midY - 5}" font-size="10" fill="red" text-anchor="middle">${edge.weight}</text>`;
            }

            let nodesSVG = '';
            for (let i = 0; i < n; i++) {
                const pos = positions[i];
                nodesSVG += `<circle cx="${pos.x}" cy="${pos.y}" r="${nodeRadius}" fill="lightblue" stroke="black"/>`;
                nodesSVG += `<text x="${pos.x}" y="${pos.y}" font-size="12" text-anchor="middle" dominant-baseline="middle">${i + 1}</text>`;
            }

            const arrowMarker = directed ? `
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5"
            markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>
    </marker>
  </defs>` : '';

            return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
${arrowMarker}
${edgesSVG}
${nodesSVG}
</svg>`;
        } else {
            const matrix = lines.map(line =>
                line.trim().split(/\s+/).map(Number)
            );
            return svgFromMatrix(matrix);
        }
    } else {
        return svgFromMatrix(graphData);
    }
}
