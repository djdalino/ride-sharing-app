import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  Alert
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import GetLocation from 'react-native-get-location';
import axios from 'axios';
import {apiKey} from '../../utils/apiKey';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getDistance} from 'geolib';
import RideOption from '../../components/RideOption';
import {useDispatch, useSelector} from 'react-redux';
import {getFormattedDate} from '../../utils/dateFormatter';
import {updateStatus} from '../../store/ride-slice/ride-actions';
import {statusConstant} from '../../utils/constant/status';

const Home = ({navigation, route}) => {
  const dispatch = useDispatch();
  const destination = route?.params?.details;
  const fromMetersToKms = route?.params?.fromMetersToKms;
  const geometry = destination?.geometry;
  const location = geometry?.location;
  const latitude = location?.lat;
  const longitude = location?.lng;

  const customer = useSelector(state => state.ride);
  const filteredCustomer = customer.filter(custom =>
    ['PENDING', 'DROPPED-OFF'].includes(custom.status),
  );
  const acceptedCustomer = customer.find(custom =>
    ['STARTED', 'PICKED-UP', 'ACCEPTED'].includes(custom.status),
  );

console.log({filteredCustomer})
  const nextProcess = (id, status) => {
    const nextStat = {
      ACCEPTED: 'Picked-up',
      'PICKED-UP': 'Started',
      STARTED: 'Dropped-off'
    }
    const nextProc = {
      ACCEPTED: 'PICKED-UP',
      'PICKED-UP': 'STARTED',
      STARTED: 'DROPPED-OFF',
      'DROPPED-OFF': 'DONE'
    }

   
    return (
      <TouchableOpacity
        onPress={() => handleProcess(id, nextProc[status])}
        style={{
          backgroundColor:
            acceptedCustomer.status === 'STARTED' ? 'red' : 'green',
          paddingHorizontal: 30,
          paddingVertical: 12,
          borderRadius: 5,
        }}>
        <Text style={{color: 'white', textAlign: 'center'}}>
          {nextStat[status]}
        </Text>
      </TouchableOpacity>
    )
  }

  const handleProcess = (id, statusText) => {
    dispatch(
      updateStatus({driverId: 123, id: id, status: statusConstant[statusText]}),
    );
    if(statusText === 'DROPPED-OFF'){
      Alert.alert('Done', 'Dropped off', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
  
    }
  };
  const mapRef = useRef();
  const [userLocation, setuserLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [origin, setorigin] = useState(null);

  const coordinates = [
    {latitude: userLocation.latitude, longitude: userLocation.longitude},
    {
      latitude: acceptedCustomer?.destination?.latitude,
      longitude: acceptedCustomer?.destination?.longitude,
    },
  ];

  useEffect(() => {
    const getLocation = () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000,
      })
        .then(async location => {
          setuserLocation({
            latitude: location.latitude,
            longitude: location.longitude,
          });

          if (mapRef) {
            mapRef.current.animateToRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          }

          const {data} =
            await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${apiKey}
          `);
          console.log(
            data.results[0].formatted_address,
            '--from current location',
          );
          setorigin(data.results[0].formatted_address);
        })
        .catch(error => {
          const {code, message} = error;
          console.warn(code, message);
        });
    };
    getLocation();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      const coordinates = [
        {latitude: userLocation.latitude, longitude: userLocation.longitude},
        {
          latitude: latitude,
          longitude: longitude,
        },
      ];

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 200, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [latitude, longitude, userLocation]);

  useEffect(() => {
    if (acceptedCustomer?.status === 'ACCEPTED') {
      console.log(
        'USERLOCATION: ',
        userLocation,
        'PICKUP LOCATION: ',
        acceptedCustomer.pickupLocation,
        'STATUS: ',
        acceptedCustomer?.status,
      );
    }
    if (acceptedCustomer?.status === 'STARTED') {
      console.log(
        'USERLOCATION: ',
        userLocation,
        'PICKUP LOCATION: ',
        acceptedCustomer.destination,
        'STATUS: ',
        acceptedCustomer?.status,
      );
    }
  }, [customer]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 0.7}}>
        <MapView
          ref={mapRef}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={false}
          showsMyLocationButton={false}
          initialRegion={{
            latitude: userLocation ? userLocation?.latitude : 37.78825,
            longitude: userLocation ? userLocation?.longitude : -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: userLocation?.latitude,
              longitude: userLocation?.longitude,
            }}
          />

          {acceptedCustomer?.status === 'ACCEPTED' && (
            <Marker
              key={1}
              coordinate={{
                latitude: acceptedCustomer?.pickupLocation?.latitude,
                longitude: acceptedCustomer?.pickupLocation?.longitude,
              }}
              pinColor="yellow"
            />
          )}

          {acceptedCustomer?.status === 'STARTED' && (
            <Marker
              key={1}
              coordinate={{
                latitude: acceptedCustomer?.destination?.latitude,
                longitude: acceptedCustomer?.destination?.longitude,
              }}
              pinColor="yellow"
            />
          )}

          {longitude && latitude && (
            <Polyline
              coordinates={coordinates}
              strokeColor="black" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={1.7}
            />
          )}
        </MapView>
        <View
          style={{
            position: 'absolute',
            right: 20,
            top: 35,
            left: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 100,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons name="menu" size={27} color="grey" />
          </View>

          <View
            style={{
              backgroundColor: 'white',
              flex: 1,
              borderRadius: 20,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}>
            <Entypo name="circle" size={18} color="green" />
            <TextInput
              style={{flex: 1}}
              value={origin}
              numberOfLines={1}
              placeholder="Current Location"
            />
          </View>
        </View>
      </View>

      {/* ///Second Box/// */}
      <View
        style={{
          flex: 0.5,
          padding: 20,
        }}>
        <View
          style={{
            backgroundColor: '#EEEEEE',
            flex: 1,
            borderRadius: 25,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              margin: 10,
              borderRadius: 15,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              padding: 10,
            }}>
            <Text>Customer List</Text>
          </View>

          {/* ////Booking Options /// */}
          <SafeAreaView style={{flex: 1}}>
            {!acceptedCustomer ? (
              <ScrollView>
                <FlatList
                  data={filteredCustomer}
                  renderItem={({item}) => (
                    <RideOption
                      icon={'person'}
                      title={item.userId}
                      id={item.id}
                      fromMetersToKms={5}
                      price={200}
                      status={item.status}
                    />
                  )}
                  keyExtractor={item => item.id}
                />
              </ScrollView>
            ) : (
              <View>
                <RideOption
                  icon={'person'}
                  title={acceptedCustomer.userId}
                  id={acceptedCustomer.id}
                  fromMetersToKms={5}
                  price={200}
                  status={acceptedCustomer.status}
                />
                <View style={{padding: 10}}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text> Email: sampleEmail@gmail.com </Text>
                    <Text> Mobile: 0912356462 </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      marginTop: 5,
                    }}>
                    <Text>
                      Pickup Time:{' '}
                      {getFormattedDate(acceptedCustomer?.pickupTime)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                    {nextProcess(acceptedCustomer?.id, acceptedCustomer?.status)}
                    {acceptedCustomer?.status !== 'STARTED' && <TouchableOpacity
                    style={{
                      backgroundColor: 'red',
                      paddingHorizontal: 30,
                      paddingVertical: 12,
                      padding: 4,
                      borderRadius: 5,
                    }}>
                       <Text style={{color: 'white', textAlign: 'center'}}>
                      Decline
                    </Text>
                    
                  </TouchableOpacity>}
                </View>
              </View>
            )}
          </SafeAreaView>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
