import React, { useState } from 'react';

interface Props {}

const Counter: React.FC<Props> = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">{count}</h1>
      <div className="flex space-x-2">
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded"
          onClick={increment}
        >
          Increment
        </button>
        <button
          className="px-4 py-2 text-white bg-red-500 rounded"
          onClick={decrement}
        >
          Decrement
        </button>
      </div>
    </div>
  );
};

export default Counter;
