import React from 'react';
import { useState } from "react";


// crocks
import Either from "crocks/Either";

// helpers
import liftA2 from "crocks/helpers/liftA2";

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

// ensureValidString :: s -> List s
const ensureValidString = ifElse(and(not(isEmpty), isString), Right, Left);


const fullName = liftA2(firstName => lastName => {
    return `${firstName} ${lastName}`;
});

const FullNamePlaceholder = () => {
    return <strong>[E] Please enter first and last names</strong>;
}

const EitherFormFun = props => {

    const [values, setValues] = useState({});
  
    const handleChange = (event) => {
      const { target } = event;
      const { name, value } = target;
      event.persist();
      setValues({ ...values, [name]: value });
    };
  
    const firstName = ensureValidString(values.firstName);
    const lastName = ensureValidString(values.lastName);
  
    return (
      <form>
        <label>
          First Name:
          { <input onChange={handleChange} value={either(constant(''), identity)(firstName)} type="text" name="firstName" /> }
        </label>
        <label>
          Last Name:
          { <input onChange={handleChange} value={either(constant(''), identity)(lastName)} type="text" name="lastName" /> }
        </label>
        <div>
          {/* Fullname: { fullName(firstName)(lastName).option(<FullNamePlaceholder/>) } */}
          Fullname: { either(constant(<FullNamePlaceholder/>), identity)(fullName(firstName)(lastName)) }
        </div>
      </form>
    );
  };

  export default EitherFormFun;