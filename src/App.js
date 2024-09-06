import React, { Suspense, lazy } from 'react';
import './App.css';

const VideoPlayer = lazy(() => import('./components/VideoPlayer'));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Suspense fallback={<div>Loading...</div>}>
        <VideoPlayer />
        </Suspense>
      </header>
    </div>
  );
}

export default App;
