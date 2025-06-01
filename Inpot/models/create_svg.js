export function createGraphSVG(graphData) {
    let matrix;
    
    if (typeof graphData === 'string') {
        const trimmed = graphData.trim();
        const firstLine = trimmed.split('\n')[0];
       
        if (firstLine.toLowerCase().startsWith("node")) {
           
            const lines = trimmed.split('\n');
            const n = lines.length;
            
            matrix = Array.from({ length: n }, () => new Array(n).fill(0));
           
            lines.forEach(line => {
                const match = line.match(/node\s*(\d+):\s*(.*)/i);
                if (match) {
                    const nodeIndex = parseInt(match[1], 10) - 1; 
                    const targets = match[2].split(/\s+/).filter(token => token.length > 0);
                    targets.forEach(t => {
                        const targetIndex = parseInt(t, 10) - 1;
                        
                        matrix[nodeIndex][targetIndex] = 1;
                    });
                }
            });
        } else {
            
            matrix = trimmed.split('\n').map(line =>
                line.trim().split(/\s+/).map(Number)
            );
        }
    } else {
        matrix = graphData;
    }
    
  
    const n = matrix.length;
    const width = 500, height = 500;
    const centerX = width / 2, centerY = height / 2;
    const layoutRadius = Math.min(width, height) / 2 - 50; 
    const nodeRadius = 10;
    

    const positions = [];
    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n;
        const x = centerX + layoutRadius * Math.cos(angle);
        const y = centerY + layoutRadius * Math.sin(angle);
        positions.push({ x, y });
    }
    
  
    let edgesSVG = '';
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] !== 0) {
                edgesSVG += `<line x1="${positions[i].x}" y1="${positions[i].y}" x2="${positions[j].x}" y2="${positions[j].y}" stroke="black" stroke-width="1" />\n`;
            }
        }
    }
    

    let nodesSVG = '';
    for (let i = 0; i < n; i++) {
        nodesSVG += `<circle cx="${positions[i].x}" cy="${positions[i].y}" r="${nodeRadius}" fill="lightblue" stroke="black" stroke-width="1" />\n`;
        nodesSVG += `<text x="${positions[i].x + nodeRadius + 2}" y="${positions[i].y + 4}" font-size="12" fill="black">${i + 1}</text>\n`;
    }
    
  
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Optionally add arrow markers for directed graphs here -->
  </defs>
  ${edgesSVG}
  ${nodesSVG}
</svg>`;
    
    return svg;
}