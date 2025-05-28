import { numberModel } from './numberModel.js';
export const vectorModel = {

    generateVector(elem, min, max, parity, sign, sorted, unique, type, palindrome, line){
        if(line>elem){
            return ['Invalid line length'];
        }
        let numbers = [];
        if(palindrome ==='yes'){
            for(let i = 0; i < elem; i++){
                if(i < Math.ceil(elem/2)){
                    numbers.push(numberModel.generateNumbers(min, max, 1, parity, sign, sorted, unique, type, 'none', false, false, false, false, false, false, 1)[0]);
                }else{
                    numbers.push(numbers[elem-i-1]);
                }
            }
        }
        else
        numbers=numberModel.generateNumbers(min, max, elem, parity, sign, sorted, unique, type, 'none', false, false, false, false, false, false, 1);
        return numbers;
    }
};