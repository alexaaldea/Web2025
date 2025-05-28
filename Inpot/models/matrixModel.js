export const matrixModel = {
    generateMatrix(row, col, min, max, parity, sign, unique, map) {
        if (map === 'yes') {
            const directions = [
                [0, 1], [1, 0], [-1, 0], [0, -1]
            ];

            const isValidCell = (x, y, grid, visited) =>
                x >= 0 && x < row &&
                y >= 0 && y < col &&
                grid[x][y] === 0 &&
                !visited[x][y];

            const bfsPathExists = (grid) => {
                const queue = [[0, 0]];
                const visited = Array.from({ length: row }, () => Array(col).fill(false));
                visited[0][0] = true;

                while (queue.length) {
                    const [x, y] = queue.shift();
                    if (x === row - 1 && y === col - 1) return true;

                    for (const [dx, dy] of directions) {
                        const nx = x + dx, ny = y + dy;
                        if (isValidCell(nx, ny, grid, visited)) {
                            visited[nx][ny] = true;
                            queue.push([nx, ny]);
                        }
                    }
                }
                return false;
            };

            const tryLimit = 100;
            for (let attempt = 0; attempt < tryLimit; attempt++) {
                const matrix = [];

                for (let i = 0; i < row; i++) {
                    const rowArr = [];
                    for (let j = 0; j < col; j++) {
                        if ((i === 0 && j === 0) || (i === row - 1 && j === col - 1)) {
                            rowArr.push(0);
                        } else {
                            rowArr.push(Math.random() < 0.7 ? 0 : -1); 
                        }
                    }
                    matrix.push(rowArr);
                }

                if (bfsPathExists(matrix)) {
                    return matrix;
                }
            }

            return ['Could not generate a valid map with a path from start to end.'];
        }

       
        const matrix = [];
        const results = new Set();
        const useUnique = unique === 'yes';
        const total_elem = row * col;

        if (useUnique) {
            let validValues = [];
            for (let num = min; num <= max; num++) {
                if (sign === '+' && num < 0) continue;
                if (sign === '-' && num > 0) continue;
                if (parity === 'even' && Math.abs(num) % 2 !== 0) continue;
                if (parity === 'odd' && Math.abs(num) % 2 !== 1) continue;
                validValues.push(num);
            }

            if (validValues.length < total_elem) {
                return ['Impossible to generate that many unique values.'];
            }
        }

        for (let i = 0; i < row; i++) {
            const rowArr = [];
            for (let j = 0; j < col; j++) {
                let num, attempts = 0, maxAttempts = 100000;

                while (attempts++ < maxAttempts) {
                    num = min + Math.floor(Math.random() * (max - min + 1));
                    let isValid = true;

                    if (parity === 'even' && Math.abs(num) % 2 !== 0) isValid = false;
                    else if (parity === 'odd' && Math.abs(num) % 2 !== 1) isValid = false;
                    if (sign === '+' && num < 0) isValid = false;
                    else if (sign === '-' && num > 0) isValid = false;
                    if (useUnique && results.has(num)) isValid = false;

                    if (isValid) {
                        if (useUnique) results.add(num);
                        break;
                    }
                }

                if (attempts >= maxAttempts) {
                    return [`Could not find a valid number after ${maxAttempts} attempts.`];
                }

                rowArr.push(num);
            }
            matrix.push(rowArr);
        }

        return matrix;
    }
};
