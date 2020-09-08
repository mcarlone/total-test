import Result from "crocks/Result";
const { Err, Ok } = Result;

import equals from 'crocks/pointfree/equals'

import tryCatch from "crocks/Result/tryCatch";
import isNumber from "crocks/predicates/isNumber";

const add = (a, b) => {
    if(!isNumber(a) || !isNumber(b)) {
        throw TypeError("a and b must be numbers");
    } else {
        return a + b;
    }
}

const safeAdd = tryCatch(add);

test('tryCatch is OK', () => {
    expect(
        equals(safeAdd(1, 4), Ok(5)) 
    ).toBe(true);

    expect(safeAdd(1, 'four').inspect()).toEqual(expect.stringMatching("TypeError"));
})