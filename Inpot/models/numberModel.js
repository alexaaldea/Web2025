export const numberModel = {
    generateNumbers(min, max, count, parity, sign, sorted, unique, type, pattern, includeZero, includeMin, includeMax, edgeEmpty, edgeSingle, edgeAllEqual, step) {
        let numbers = [];

        if (edgeEmpty) return [];
        if (edgeSingle) return [formatNumber(min, type)];
        if (edgeAllEqual) return Array(count).fill(formatNumber(min, type));

        if (isNaN(min) || isNaN(max) || isNaN(count) || min > max || count <= 0) {
            return ['Invalid input'];
        }

        if ((pattern === 'arithmetic' || pattern === 'geometric') && (parity === 'odd' || parity === 'even')) {
            return ['Filter combination is too restrictive: progression with parity not supported'];
        }

        if (type === 'float' && (parity === 'odd' || parity === 'even')) {
            return ['Filter combination is too restrictive: float numbers cannot be odd or even'];
        }


        if (type === 'integer') {
            min = Math.ceil(min);
            max = Math.floor(max);
        }

        if (pattern == 'arithmetic') {
            if (isNaN(step) || step <= 0) {
                return ['Invalid step size'];
            }
            for (let i = 0; i < count; i++) {
                if (formatNumber(min + i * step, type) > max) {
                    return ['Generated number exceeds max'];
                }
                numbers.push(formatNumber(min + i * step, type));
            }
            return numbers;
        }
        else if (pattern == 'geometric') {
            if (isNaN(step) || step <= 1) {
                return ['Invalid step size'];
            }
            for (let i = 0; i < count; i++) {
                if (formatNumber(min * Math.pow(step, i), type) > max) {
                    return ['Generated number exceeds max'];
                }
                numbers.push(formatNumber(min * Math.pow(step, i), type));
            }
            return numbers;
        }

        if (unique && count > (max - min + 1)) {
            return ['Count exceeds range'];
        }
        const addIfUnique = (num) => {
            if (!unique || !numbers.includes(num)) {
                numbers.push(num);
            }
        };

        if (includeZero && min <= 0 && max >= 0) {
            addIfUnique(formatNumber(0, type));
        }
        if (includeMin) {
            addIfUnique(formatNumber(min, type));
        }
        if (includeMax) {
            addIfUnique(formatNumber(max, type));
        }

        if (unique && count > numberOfOptions(min, max, parity, sign, type)) {
            return ['Not able to generate unique numbers with current filters'];
        }
        let attempts = 0;
        const MAX_ATTEMPTS = 10000;
        while (numbers.length < count && attempts < MAX_ATTEMPTS) {
            attempts++;
            let num;
            if (type === 'float') {
                num = Math.random() * (max - min) + min;
            } else {
                num = Math.floor(Math.random() * (max - min + 1)) + min;
            }

            if (parity === 'even' && num % 2 !== 0) continue;
            if (parity === 'odd' && num % 2 === 0) continue;
            if (sign === 'positive' && num < 0) continue;
            if (sign === 'negative' && num > 0) continue;

            addIfUnique(formatNumber(num, type));
        }

        if (attempts === MAX_ATTEMPTS) {
            return ['Too many attempts. Filters may be too restrictive'];
        }

        if (numbers.length < count) {
            return ['Could not generate enough numbers with current filters'];
        }

        if (sorted === 'ascending') {
            numbers.sort((a, b) => a - b);
        } else if (sorted === 'descending') {
            numbers.sort((a, b) => b - a);
        }

        return numbers.map(num => formatNumber(num, type));
    },
};

function formatNumber(num, type) {
    return type === 'float' ? parseFloat(num.toFixed(2)) : Math.round(num);
}

function numberOfOptions(min, max, parity, sign, type) {
    let options = 0;
    for (let i = min; i <= max; i++) {
        if (type === 'float') continue;
        if (parity === 'even' && i % 2 !== 0) continue;
        if (parity === 'odd' && i % 2 === 0) continue;
        if (sign === 'positive' && i < 0) continue;
        if (sign === 'negative' && i > 0) continue;
        options++;
    }
    return options;
}