export const stringModel = {
    generateStrings(minLength, maxLength, unique, letters, count, sameLength, prefix, suffix, sorting) {
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
            let len;
            if (sameLength) {
                 len= sameLength;
            }
                else{
                     len = getRandomLength();
                }
            let str = '';
            if (prefix) {
                str += prefix;
                len= len - prefix.length;
            }
            if (suffix) {
                len= len - suffix.length;
            }
            for (let i = 0; i < len; i++) {
                str += getRandomChar();
            }
            if(suffix){
                 str += suffix;
            }
            return str;
        };

        const sortStrings = (a, b) => {
            if (sorting === 'asc') return a.length > b.length ? 1 : -1;
            if (sorting === 'desc') return a.length < b.length ? 1 : -1;
            if (sorting === 'alph') return a.localeCompare(b);
            if (sorting === 'revAlph') return b.localeCompare(a);
            return 0;
        };

        if(minLength>maxLength){
            return ['Invalid input. Min length cannot be greater than max length.'];
        }
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
        if(sorting !== 'none'){
            return Array.from(results).sort(sortStrings).slice(0, count);
        }else
            return Array.from(results).slice(0, count);
    }
};
