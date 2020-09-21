import React from 'react';
import { useState } from "react";


// crocks
import Either from "crocks/Either";
import Pair from "crocks/Pair";

// helpers
import compose from "crocks/helpers/compose";

// predicates
import { isString, isEmpty } from 'crocks/predicates'

// logic
import not from 'crocks/logic/not'
import and from 'crocks/logic/and';
import ifElse from 'crocks/logic/ifElse';

// pointfree
import either from 'crocks/pointfree/either'

// combinators
import identity from 'crocks/combinators/identity'
import constant from 'crocks/combinators/constant'

const { Left, Right } = Either;












const add = x => y => x + y;
const twentyThree = Pair([ 23 ], 23);
console.log('mmaapp', twentyThree.map(add).inspect());

const pairNames = Pair('matt', 'carlone');
pairNames.map((f, l) => console.log('pair map', f, l))



// const doSomethingToFive = applyTo(5);
// doSomethingToFive(a => a + 2) // 7


//compose
const name = compose(
    either(constant(''), identity),
    ifElse(and(not(isEmpty), isString), Right, Left)
);  

const eitherString = ifElse(and(not(isEmpty), isString), Right, Left);

console.log('eitherString', Right('matt').chain(eitherString).inspect())

const EitherFormFun = props => {

    const [values, setValues] = useState({});
  
    const handleChange = (event) => {
      const { target } = event;
      const { name, value } = target;
      event.persist();
      setValues({ ...values, [name]: value });
    };
  
    return (
      <form>
        <label>
          First Name:
          { <input onChange={handleChange} value={name(values.firstName)} type="text" name="firstName" /> }
        </label>
        <label>
          Last Name:
          { <input onChange={handleChange} value={name(values.lastName)} type="text" name="lastName" /> }
        </label>
        <div>
          {/* Fullname: { either(constant(<FullNamePlaceholder/>), identity)(fullName(firstName)(lastName)) } */}
          {/* Fullname: { either(constant(<FullNamePlaceholder/>), identity)(fullName(firstName)(lastName)) } */}
        </div>
      </form>
    );
  };

  export default EitherFormFun;