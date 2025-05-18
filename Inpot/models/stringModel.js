export const stringModel = {
    generateStrings(minLength, maxLength, unique, letters, count) {
        const results = new Set();
        const useUnique = unique === 'yes';

        if (!letters || letters.length === 0 || isNaN(minLength) || isNaN(maxLength) || isNaN(count)) {
            return ['Invalid input.'];
        }

        const getRandomLength = () => 
            Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

        const getRandomChar = () =>
            letters[Math.floor(Math.random() * letters.length)];

        const generateRandomString = () => {
            const len = getRandomLength();
            let str = '';
            for (let i = 0; i < len; i++) {
                str += getRandomChar();
            }
            return str;
        };

        while (results.size < count) {
            const str = generateRandomString();
            if (useUnique) {
                results.add(str);
                if (results.size >= count) break;

                if (results.size === Math.pow(letters.length, maxLength)) 
                    return ['Impossible to generate that many unique strings.'];
            } else {
                results.add(str);
                if (results.size >= count) break;
            }
        }

        return Array.from(results).slice(0, count);
    }
};
