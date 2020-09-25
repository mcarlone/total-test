import React, { useEffect, useState } from 'react';
import './App.css';
import { getLines } from './api/mbta/lines';
import { compose, Maybe } from 'crocks';

const { Just } = Maybe;

const initialLinesState = [];

const MbtaLines = () => {
  const [lines, setlines] = useState(initialLinesState);

  useEffect(() => {
    const reportError = err => console.error('Error fetchiing Lines', err);
    const updateLines = compose(setlines, res => res.data);
    getLines({sort:'long_name'}).fork(reportError, updateLines)
  }, []);

  const debugLinesRender = ls => ls.map(MbtaLine);

  return <>{ Just(lines).map(debugLinesRender).option('ah shit') }</>;
};

const MbtaLine = (lineData) => {
  const style = {
    color: `#${lineData.attributes.color}`
  };
  return (
    <div key={lineData.id}>
      <span style={style}>{lineData.attributes.long_name}</span>
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
