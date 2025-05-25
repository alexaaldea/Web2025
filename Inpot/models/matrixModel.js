export const matrixModel = {
    generateMatrix(row, col, min, max, parity, sign, unique, map) {

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
                return ['Impossible to generate that many unique strings.'];
            }
        }

        for (let i = 0; i < row; i++) {
            const rowArr = [];

            for (let j = 0; j < col; j++) {
                let num;
                let attempts = 0;
                const maxAttempts = 10000;

                while (attempts < maxAttempts) {
                    attempts++;

                    num = min+Math.floor(Math.random() * (max - min + 1));

                    let isValid = true;

                    if (parity === 'even' && Math.abs(num) % 2 !== 0) {
                        isValid = false;
                    } else 
                    if (parity === 'odd' && Math.abs(num) % 2 !== 1) {
                        isValid = false;
                    } else
                    if (sign === '+' && num < 0) {
                        isValid = false;
                    } else if (sign === '-' && num > 0) {
                        isValid = false;
                    }

                    if (useUnique) {
                        results.add(num);
                        if (results.size != i * col + j + 1)
                            isValid = false;
                    }

                    if (isValid) {
                        break;
                    }
                }

                if (attempts >= maxAttempts) {
                    return [`Could not find a valid number after ${maxAttempts} attempts. Check your constraints.`];
                }


                rowArr.push(num);
            }

            matrix.push(rowArr);

        }

        return matrix;
    }
};
