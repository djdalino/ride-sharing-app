import initialState from "./initial-state";

export const rideReducer = (state, action) =>({
    ...state,
    ...action.payload
});
export const rideUpdateStatus = (state, action) => {
    const {id, status, driverId} = action.payload;
    const rideIndex = state.findIndex((item) => item.id === id);

    if (rideIndex !== -1) {
        const updatedRides = [...state];
        const driverID = status !== 'PENDING' ? driverId : '';
        updatedRides[rideIndex] = { ...updatedRides[rideIndex], driverId: driverID, status: status };
        return updatedRides
      } else {
        console.log(`Ride with ID ${id} not found in state.`);
        return state;
      }
}