import React from 'react';

if (process.env.NODE_ENV === "development") console.log('development');
if (process.env.NODE_ENV === "production") console.log('production');

const App = () => {
  return <h1>Hello, ESBuild and React with Hot Reload!</h1>;
};

export default App;