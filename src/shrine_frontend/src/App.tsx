import React from 'react';
import ExampleCounter from './ExampleCounter';
import ExampleWhoami from './ExampleWhoami';

const App = () => {
  return (
    <div className="flex justify-center items-center flex-col">
      <ExampleCounter />
      <ExampleWhoami />
    </div>
  );
};

export default App;
