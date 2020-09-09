import React from 'react';
import { useState } from "react";

import logo from './logo.svg';
import './App.css';

// crocks
import prop from 'crocks/Maybe/prop'; // prop returns a Maybe

// helpers
import liftA2 from "crocks/helpers/liftA2";



// const { Just, Nothing } = Maybe;

// const an = All(Nothing());
// const aj = All(Just(1));
// console.log( an.concat(aj).valueOf() );


const FormFun = props => {

  const [values, setValues] = useState({});

  const handleChange = (event) => {
    const { target } = event;
    const { name, value } = target;
    // event.persist();
    setValues({ ...values, [name]: value });
  };

  const maybeFirstName = prop('firstName', values);
  const maybeLastName = prop('lastName', values);

  const fullName = firstName => lastName => {
    console.log('fullname call:', firstName, lastName)
    return `${firstName} ${lastName}`;
  };

  console.log('hey', liftA2(fullName)(maybeFirstName)(maybeLastName));

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
        Fullname: { fullName(maybeFirstName.option(""), maybeLastName.option("")) }
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
