const statusConstant = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  STARTED: 'STARTED',
  'PICKED-UP': 'PICKED-UP',
  'DROPED-OFF': 'DROPED-OFF'
}


const initialState = [
    {
      id: 1, // Unique Indentifier for the ride
      userId: 'user1', // ID of the user requesting the ride
      driverId: null, // ID of the driver accepting the ride (null if not accepted)
      pickupLocation: {
        lattitude: 37.3821571,
        longitude: -122.0923715,
      },
      destination: {
        lattitude: 37.3887415,
        longitude: -122.08536930000001,
      },
      status: statusConstant['PENDING'],
      pickupTime: new Date(),
      timestamp: new Date()
    },
    {
      id: 2, // Unique Indentifier for the ride
      userId: 'user2', // ID of the user requesting the ride
      driverId: null, // ID of the driver accepting the ride (null if not accepted)
      pickupLocation: {
        lattitude: 37.3821571,
        longitude: -122.0923715,
      },
      destination: {
        lattitude: 37.3887415,
        longitude: -122.08536930000001,
      },
      status: statusConstant['PENDING'],
      pickupTime: new Date(),
      timestamp: new Date()
    }, 
    {
      id: 3, // Unique Indentifier for the ride
      userId: 'user3', // ID of the user requesting the ride
      driverId: null, // ID of the driver accepting the ride (null if not accepted)
      pickupLocation: {
        lattitude: 37.3821571,
        longitude: -122.0923715,
      },
      destination: {
        lattitude: 37.3887415,
        longitude: -122.08536930000001,
      },
      status: statusConstant['PENDING'],
      pickupTime: new Date(),
      timestamp: new Date()
    }, 
  ]

  export default initialState