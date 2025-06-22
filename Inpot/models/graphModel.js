function isConnected(matrix) {
    const n = matrix.length;
    const visited = new Array(n).fill(false);
    function dfs(node) {
        visited[node] = true;
        for (let i = 0; i < n; i++) {
            if (!visited[i] && (matrix[node][i] !== 0 || matrix[i][node] !== 0)) {
                dfs(i);
            }
        }
    }
    dfs(0);
    return visited.every(val => val === true);
}

export const graphModel = {
    generateGraph(node, edge, oriented, connected, bipartit, weighted, min_weight, max_weight, format) {
       
        if (connected === 'yes' && edge < node - 1) {
            return `Error: Cannot generate a connected graph with fewer than ${node - 1} edges.`;
        }

        if ( edge > (node*(node - 1))/2) {
            return `Error: Cannot generate a graph with more than ${((node - 1)*node)/2} edges.`;
        }
      
        if (connected === 'no' && edge > node * (node - 2) / 2) {
            return `Error: Cannot generate a disconnected graph with more than ${node * (node - 2) / 2} edges.`;
        }
        
        const matrix = Array.from({ length: node }, () => new Array(node).fill(0));
        let possibleEdges = [];
        
        if (bipartit === true) {
            const partitionSize = Math.floor(node / 2);
            const part1 = [];
            const part2 = [];
            for (let i = 0; i < node; i++) {
                if (i < partitionSize) {
                    part1.push(i);
                } else {
                    part2.push(i);
                }
            }
            if (oriented == 'yes') {
                for (let i = 0; i < part1.length; i++) {
                    for (let j = 0; j < part2.length; j++) {
                        possibleEdges.push([part1[i], part2[j]]);
                        possibleEdges.push([part2[j], part1[i]]);
                    }
                }
            } else {
                for (let i = 0; i < part1.length; i++) {
                    for (let j = 0; j < part2.length; j++) {
                        possibleEdges.push([part1[i], part2[j]]);
                    }
                }
            }
        } else {
            if (oriented == 'yes') {
                for (let i = 0; i < node; i++) {
                    for (let j = 0; j < node; j++) {
                        if (i !== j) {
                            possibleEdges.push([i, j]);
                        }
                    }
                }
            } else {
                for (let i = 0; i < node; i++) {
                    for (let j = i + 1; j < node; j++) {
                        possibleEdges.push([i, j]);
                    }
                }
            }
        }
        
        // Randomize edge order.
        for (let i = possibleEdges.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [possibleEdges[i], possibleEdges[j]] = [possibleEdges[j], possibleEdges[i]];
        }
        
        const numEdges = edge;
        
        for (let k = 0; k < numEdges; k++) {
            const [i, j] = possibleEdges[k];
            let weight;
            if (weighted == 'yes') {
                if (isNaN(min_weight) || isNaN(max_weight)) {
                    weight = Math.floor(Math.random() * 100) + 1;
                } else {
                    weight = Math.floor(Math.random() * (max_weight - min_weight + 1)) + min_weight;
                }
            } else {
                weight = 1;
            }
            matrix[i][j] = weight;
            if (oriented == 'no') {
                matrix[j][i] = weight;
            }
        }
        
    
        if (connected === 'yes') {
            if (!isConnected(matrix)) {
                return graphModel.generateGraph(node, edge, oriented, connected, bipartit, weighted, min_weight, max_weight, format);
            }
        } else if (connected === 'no') {
            if (isConnected(matrix)) {
                return graphModel.generateGraph(node, edge, oriented, connected, bipartit, weighted, min_weight, max_weight, format);
            }
        }
        
        if (format === 'edge') {
            let result = "";
            if (oriented === 'yes') {
                for (let i = 0; i < node; i++) {
                    for (let j = 0; j < node; j++) {
                        if (matrix[i][j] !== 0) {
                            if (weighted === 'yes') {
                                result += `${i + 1} ${j + 1} ${matrix[i][j]}\n`;
                            } else {
                                result += `${i + 1} ${j + 1}\n`;
                            }
                        }
                    }
                }
            } else {
                for (let i = 0; i < node; i++) {
                    for (let j = i + 1; j < node; j++) {
                        if (matrix[i][j] !== 0) {
                            if (weighted === 'yes') {
                                result += `${i + 1} ${j + 1} ${matrix[i][j]}\n`;
                            } else {
                                result += `${i + 1} ${j + 1}\n`;
                            }
                        }
                    }
                }
            }
            return result;
        } else {
            return matrix.map(row => row.join(' ')).join('\n');
        }
    }
};