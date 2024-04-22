import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { rideApi } from './api/rideApi'
import rideReducer from './ride-slice/ride-slice'

export const store = configureStore({
  reducer: {
    ride: rideReducer,
    // Add the generated reducer as a specific top-level slice
    // [rideApi.reducerPath]: rideApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware().concat(rideApi.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)