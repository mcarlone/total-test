import React from 'react';
import { useState } from "react";

import './App.css';

// crocks


// helpers

// import safe from "crocks/Maybe/safe";


// predicates


// logic


// pointfree


const MbtaLines = () => {
  const [lines] = useState({data:[]});

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
