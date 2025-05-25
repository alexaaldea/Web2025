export const matrixModel = {
    generateMatrix(row, col, min, max, parity, sign, map) {
        const matrix = [];

        for (let i = 0; i < row; i++) {
            const rowArr = [];

            for (let j = 0; j < col; j++) {
                let num;
                let attempts = 0;
                const maxAttempts = 100;

                while (attempts < maxAttempts) {
                    attempts++;

                    num = Math.floor(Math.random() * (max - min + 1)) + min;

                    if (sign === '+' && num < 0) {
                        num = -num;
                    } else if (sign === '-' && num > 0) {
                        num = -num;
                    }

                    let isValid = true;

                    if (parity === 'even' && Math.abs(num) % 2 !== 0) {
                        isValid = false;
                    } else if (parity === 'odd' && Math.abs(num) % 2 !== 1) {
                        isValid = false;
                    }

                    if (isValid) {
                        break;
                    }
                }

                if (attempts >= maxAttempts) {
                    throw new Error(`Could not find a valid number after ${maxAttempts} attempts. Check your constraints.`);
                }


                rowArr.push(num);
            }

            matrix.push(rowArr);
        }

        return matrix;
    }
};
