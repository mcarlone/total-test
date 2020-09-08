import Result from "crocks/Result";
const { Err, Ok } = Result;

import equals from 'crocks/pointfree/equals'

import tryCatch from "crocks/Result/tryCatch";
import isNumber from "crocks/predicates/isNumber";

const add = (a, b) => {
    if(isNumber(a) && isNumber(b)) {
        return a + b;
    }

    throw TypeError("a and b must be numbers");
}

console.log(Err("TypeError: a and b must be numbers"));


const safeAdd = tryCatch(add);

test('tryCatch is OK', () => {
    expect(
        equals(safeAdd(1, 4), Ok(5)) 
    ).toBe(true);

    expect(safeAdd(1, 'four').equals(Err("TypeError: a and b must be numbers"))).toBe(true);

    expect(
        equals(safeAdd(1, 'four').inspect(), Err("TypeError: a and b must be numbers").inspect()) 
    ).toBe(true);
})