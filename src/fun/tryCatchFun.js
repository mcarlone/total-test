import tryCatch from "crocks/Result/tryCatch";
import isNumber from "crocks/predicates/isNumber";

const add = (a, b) => {
    if(isNumber(a) && isNumber(b)) {
        return a + b;
    }

    throw TypeError("a and b must be numbers");
}

console.log("adding...", add(1, 3));


const safeAdd = tryCatch(add);

safeAdd(1, 4).inspect(); // "Ok 5"
safeAdd(1, 'fart').inspect(); // "Err TypeError: a and b must be numbers"