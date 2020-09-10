import React from 'react';
import { useState } from "react";

import logo from './logo.svg';
import './App.css';

// crocks
import Maybe from "crocks/Maybe";
// import prop from 'crocks/Maybe/prop'; // prop returns a Maybe

// helpers
import liftA2 from "crocks/helpers/liftA2";
// import safe from "crocks/Maybe/safe";
import compose from "crocks/helpers/compose";
import fanout from "crocks/Pair/fanout";

// predicates
import { isString, isEmpty } from 'crocks/predicates'

// logic
import not from 'crocks/logic/not'
import and from 'crocks/logic/and';
import ifElse from 'crocks/logic/ifElse';

// pointfree
import merge from 'crocks/pointfree/merge'


const { Just, Nothing } = Maybe;


// Pair/fanout/merge fun
const upAndDown = fanout(a => Just(a + 1), a => Just(a - 1));
const upAndDownPair = upAndDown(5);
console.log('upAndDown', upAndDownPair.inspect()) // upAndDown(2) === Pair(3, 1)

// const report = (f, s) => `Hey its ${f} and ${s}`;
const add = f => s => f + s;
console.log('double p', merge(liftA2(add), upAndDownPair).inspect());

// ...same, but using composition
const flow = compose(
  merge(liftA2(add)),
  fanout(a => Just(a + 1), a => Just(a - 1))
);

console.log('flow', flow(5).inspect())
// END Pair/fanout/merge fun









// ensureValidString :: s -> Maybe s
const ensureValidString = ifElse(and(not(isEmpty), isString), Just, Nothing);

// fullName :: Maybe String -> Maybe String -> Maybe String
// MC note: liftA2 lifts a function to take monads going in, unwraps them, 
//          applys the function, and returns the result in the same monad 
//          type. If Nothing is input, then the func returns a Nothing instence.
const fullName = liftA2(firstName => lastName => {
  return `${firstName} ${lastName}`;
});

const FullNamePlaceholder = () => {
  return <strong>Please enter first and last names</strong>;
}

const FormFun = props => {

  const [values, setValues] = useState({});

  const handleChange = (event) => {
    const { target } = event;
    const { name, value } = target;
    event.persist();
    setValues({ ...values, [name]: value });
  };

  const maybeFirstName = ensureValidString(values.firstName);
  const maybeLastName = ensureValidString(values.lastName);

  return (
    <form>
      <label>
        First Name:
        { <input onChange={handleChange} value={maybeFirstName.option("")} type="text" name="firstName" /> }
      </label>
      <label>
        Last Name:
        { <input onChange={handleChange} value={maybeLastName.option("")} type="text" name="lastName" /> }
      </label>
      <div>
        Fullname: { fullName(maybeFirstName)(maybeLastName).option(<FullNamePlaceholder/>) }
      </div>
    </form>
  );
};




function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. (GK)
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <FormFun/>
    </div>
  );
}

export default App;
