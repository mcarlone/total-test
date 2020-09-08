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

const ensureAdd = tryCatch(add);

const doubleOdd = n => {
    if(n % 2 === 0) {
        throw TypeError("number must be odd");
    } else {
        return n * 2;
    }
}
const ensureDoubleOdd = tryCatch(doubleOdd);


const fancy = v => `~~~ ${v} ~~~`;

test('tryCatch is OK', () => {
    expect(
        equals(ensureAdd(1, 4), Ok(5)) 
    ).toBe(true);

    expect( equals(ensureAdd(1, 4).map(fancy), Ok(`~~~ 5 ~~~`)) ).toBe(true);

    expect( ensureAdd(1, 'four').map(fancy).inspect() ).toEqual(expect.stringMatching("TypeError"));

    expect(ensureAdd(1, 'four').inspect()).toEqual(expect.stringMatching("TypeError"));

    expect(    equals(ensureAdd(1, 4).chain(ensureDoubleOdd), Ok(10))    ).toBe(true);
})