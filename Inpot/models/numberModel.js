export const numberModel = {
    generateNumbers(min, max, count, parity, sign, sorted, unique, type, pattern, includeZero, includeMin, includeMax, edgeEmpty, edgeSingle, edgeAllEqual, step) {
        let numbers = [];

        if(edgeEmpty) return [];
        if(edgeSingle) return [formatNumber(min, type)];
        if(edgeAllEqual) return Array(count).fill(formatNumber(min, type));

        if(isNaN(min) || isNaN(max) || isNaN(count) || min > max || count <= 0) {
            return ['Invalid input'];
        }

        if(pattern == 'arithmetic') {
            if (isNaN(step) || step <= 0) {
                return ['Invalid step size'];
            }
            for(let i = 0; i < count; i++) {
                if(formatNumber(min + i * step, type) > max) {
                    return ['Generated number exceeds max'];
                }
                numbers.push(formatNumber(min + i * step, type));
            }
            return numbers;
        }
        else if(pattern == 'geometric') {
            if (isNaN(step) || step <= 1) {
                return ['Invalid step size'];
            }
            for(let i = 0; i < count; i++) {
                if(formatNumber(min * Math.pow(step, i), type) > max) {
                    return ['Generated number exceeds max'];
                }
                numbers.push(formatNumber(min * Math.pow(step, i), type));
            }
            return numbers;
        }
        
        if(unique && count > (max - min + 1)) {
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


        if (includeZero && min <= 0 && max >= 0) {
            numbers.push(formatNumber(0, type));
        }
        if (includeMin) {
            numbers.push(formatNumber(min, type));
        }
        if (includeMax) {
            numbers.push(formatNumber(max, type));
        }
        while(numbers.length < count) {
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

            if (!unique || !numbers.includes(num)) {
                numbers.push(num);
            }
        }

        if(numbers.length < count) {
            return ['Could not generate enough numbers with current filters'];
        }

        if (sorted === 'ascending') {
            numbers.sort((a, b) => a - b);
        } else if (sorted === 'descending') {
            numbers.sort((a, b) => b - a);
        }


        return numbers;
    },
};

function formatNumber(num, type) {
    return type === 'float' ? parseFloat(num.toFixed(2)) : Math.round(num);
}