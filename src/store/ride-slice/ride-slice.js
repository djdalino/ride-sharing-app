import { createSlice } from '@reduxjs/toolkit'
import { rideReducer, rideUpdateStatus } from './ride-reducer'
import initialState from './initial-state'

export const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    updateRide: rideReducer,
    updateStatus: rideUpdateStatus
  },
})

// Action creators are generated for each case reducer function

export default rideSlice.reducer