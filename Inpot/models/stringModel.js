export const stringModel = {
    generateStrings(minLength, maxLength, unique, letters, count, sameLength, prefix, suffix, sorting) {
        const results = new Set();
        const useUnique = unique === 'yes';

        if (!letters || letters.length === 0 || isNaN(minLength) || isNaN(maxLength) || isNaN(count)) {
            return ['Invalid input.'];
        }
        if (sameLength && ((prefix?.length || 0) + (suffix?.length || 0) > sameLength)) {
             return ['Prefix and/or suffix length exceeds the length.'];
        }
        if(!sameLength && ((prefix?.length || 0) + (suffix?.length || 0) > maxLength)){
            return ['Prefix and/or suffix length exceeds the max length.'];
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
        if(useUnique && count > calculatePossibilities(minLength, maxLength, useUnique, letters, sameLength, prefix, suffix, useUnique)){   
        return ['Impossible to generate that many unique strings.'];
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

function calculatePossibilities(minLength, maxLength, unique, letters, sameLength, prefix, suffix, useUnique) {
    let totalPossibilities = 0;
    if(sameLength){
        totalPossibilities = Math.pow(letters.length, sameLength - (prefix?.length || 0) - (suffix?.length || 0));
    }
    else{
        for (let len = minLength; len <= maxLength; len++) {
            totalPossibilities += Math.pow(letters.length, len - (prefix?.length || 0) - (suffix?.length || 0));
        }
    }
    return totalPossibilities; 
}
