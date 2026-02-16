import { useState } from 'react'



function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-slate-200 p-4'>
     
      <h1 className='font-bold text-3xl text-center'>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)} className='bg-blue-500 text-white px-4 py-2 rounded-md'>
          count is {count}
        </button>
        <p className='text-lg'>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
