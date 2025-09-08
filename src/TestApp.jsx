import React from 'react'

function TestApp() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ React is Working!</h1>
        <p className="text-gray-700">If you can see this, React is properly set up.</p>
        <button 
          onClick={() => alert('Button clicked!')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Button
        </button>
      </div>
    </div>
  )
}

export default TestApp
