import { TouchableOpacity, Text, View, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { statusConstant } from '../../utils/constant/status';
import { updateStatus } from '../../store/ride-slice/ride-actions';


const RideOption = ({id, title, status, price, icon, fromMetersToKms = 2}) => {
  const dispatch = useDispatch()

    const handleOnPress = (id, statusText) => {
      dispatch(updateStatus({driverId: 123, id: id, status: statusConstant[statusText]}))
    }

    return (
      <TouchableOpacity
        onPress={() =>
          console.log({title})
        }
        style={{
          backgroundColor: 'white',
          marginHorizontal: 10,
          marginVertical: 5,
          borderRadius: 5,
          padding: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Icon name={icon} size={20} color="black" />
          <Text style={{color: 'black', fontSize: 15, fontWeight: '600'}}>
            {title}
          </Text>
        </View>

        <Text style={{color: 'black', fontSize: 15, fontWeight: '600'}}>
          P {price}
        </Text>
        {!['ACCEPTED', 'DECLINED', 'STARTED', 'PICKED-UP', 'DROPPED-OFF'].includes(status) && <View>
            <TouchableOpacity onPress={() => handleOnPress(id, 'ACCEPTED')}>
              <Text style={{color: 'green'}}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOnPress(id, 'DECLINED')}>
              <Text style={{color: 'red'}}>Decline</Text>
            </TouchableOpacity>
        </View>}

      </TouchableOpacity>
    );
  };

  export default RideOption;