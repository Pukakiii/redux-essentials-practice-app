import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { worker } from './api/server'
import { store } from './app/store'
import { fetchUsers } from './features/users/usersSlice'

import App from './App'

import './primitiveui.css'
import './index.css'

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: 'bypass' })

  store.dispatch(fetchUsers())

  const root = createRoot(document.getElementById('root')!)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  )
}

start()
