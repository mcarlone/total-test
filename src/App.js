import React, { useEffect } from 'react';
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



import EitherFormFun from './fun/eitherFormfun';

// pointfree
import merge from 'crocks/pointfree/merge'

import Mbta from './api/mbta';

const MbtaLines = () => {
  const [lines, setlines] = useState({data:[]});

  // useEffect(() => {
  //   Mbta().lines().then(json => setlines(json));
  // }, []);

  return (
    <div>{ lines.data.map(MbtaLine) }</div>
  );
};

const MbtaLine = (lineData) => {

  const style = {
    color: `#${lineData.attributes.color}`
  };
  return (
    <div key={lineData.id}>
      Line name: <span style={style}>{lineData.attributes.long_name}</span>
    </div>
  )
};


function App() {
  return (
    <div className="App">
      MBTA funtime...
      <MbtaLines/>
    </div>
  );
}

export default App;
