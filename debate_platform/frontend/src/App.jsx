// /src/App.jsx

import { useState } from 'react'

// This is a functional React component
function App() {
  // Use React's state hook to manage a counter value
  const [count, setCount] = useState(0)

  // The 'return' statement contains your JSX (HTML-like markup)
  return (
    <div>
      <h1>Hello from React (JSX)!</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

// Export the component so it can be imported in main.jsx
export default App