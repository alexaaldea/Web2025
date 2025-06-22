export function createTreeSVG(edgeOrParent, svgSize = 'medium') {

    let edgeList;
    if (typeof edgeOrParent === 'string' && /^[0-9\s-]+$/.test(edgeOrParent.trim())) {

        const arr = edgeOrParent.trim().split(/\s+/);
        if (arr.length > 1 && (arr[0] === '0' || arr[0] === '-1')) {
            edgeList = [];
            for (let i = 1; i < arr.length; i++) {
                if (arr[i] !== '0') edgeList.push(`${arr[i]} ${i + 1}`);
            }
        } else {

            edgeList = edgeOrParent.trim().split('\n').filter(Boolean);
        }
    } else if (Array.isArray(edgeOrParent)) {
        if (edgeOrParent.length > 1 && (edgeOrParent[0] === 0 || edgeOrParent[0] === -1)) {
            edgeList = [];
            for (let i = 1; i < edgeOrParent.length; i++) {
                if (edgeOrParent[i] !== 0) edgeList.push(`${edgeOrParent[i]} ${i + 1}`);
            }
        } else {
            edgeList = edgeOrParent;
        }
    } else {
        edgeList = [];
    }


    let width = 500, height = 500, nodeRadius = 14, levelGap = 60;
    if (svgSize === 'small') {
        width = height = 300;
        nodeRadius = 9;
        levelGap = 50;
    } else if (svgSize === 'large') {
        width = height = 800;
        nodeRadius = 20;
        levelGap = 110;
    }

    const edges = edgeList.map(line => {
        const [parent, child, weight] = line.trim().split(/\s+/).map(Number);
        return { parent, child, weight: weight || 1 };
    });

    const children = {};
    const nodes = new Set();
    edges.forEach(({ parent, child }) => {
        if (!children[parent]) children[parent] = [];
        children[parent].push(child);
        nodes.add(parent);
        nodes.add(child);
    });

    const allNodes = Array.from(nodes);
    const childSet = new Set(edges.map(e => e.child));
    const root = allNodes.find(n => !childSet.has(n)) || 1;

    const positions = {};
    const levels = {};
    let maxLevel = 0;
    let queue = [{ id: root, level: 0 }];
    while (queue.length) {
        const { id, level } = queue.shift();
        levels[level] = levels[level] || [];
        levels[level].push(id);
        maxLevel = Math.max(maxLevel, level);
        if (children[id]) {
            children[id].forEach(childId => {
                queue.push({ id: childId, level: level + 1 });
            });
        }
    }

    for (let l = 0; l <= maxLevel; l++) {
        const nodesAtLevel = levels[l];
        const y = (l + 1) * levelGap;
        const margin = 20;
        const gap = (width - 2 * margin) / (nodesAtLevel.length + 1);
        nodesAtLevel.forEach((id, idx) => {
            positions[id] = {
                x: margin + gap * (idx + 1),
                y
            };
        });
    }

    let edgesSVG = '';
    edges.forEach(({ parent, child, weight }) => {
        const from = positions[parent];
        const to = positions[child];
        edgesSVG += `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="black" stroke-width="2"/>`;
        if (weight !== 1) {
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2 - 5;
            edgesSVG += `<text x="${midX}" y="${midY}" font-size="12" fill="red" text-anchor="middle">${weight}</text>`;
        }
    });

    let nodesSVG = '';
    allNodes.forEach(id => {
        const pos = positions[id];
        nodesSVG += `<circle cx="${pos.x}" cy="${pos.y}" r="${nodeRadius}" stroke="black" fill="lightgreen"/>`;
        nodesSVG += `<text x="${pos.x}" y="${pos.y}" font-size="13" text-anchor="middle" dominant-baseline="middle">${id}</text>`;
    });

    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
${edgesSVG}
${nodesSVG}
</svg>`;
}
