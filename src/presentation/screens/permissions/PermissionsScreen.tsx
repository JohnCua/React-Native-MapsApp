import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { globalStyles } from '../../../config/theme/styles';
import { usePermissionStore } from '../../store/permissions/usePermissionStore';

export const PermissionsScreen = () => {

  const { locationStatus, requestLocationPermission } = usePermissionStore();



  return (
    <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center'} }>
        <Text>Habilitar ubicacion</Text>

        <Pressable 
          style = { globalStyles.btnPrymary}
          onPress={ requestLocationPermission }
        >
          <Text style = { { color: 'white'} }>Habilitar Localizacion</Text>
        </Pressable>


       <Text>Estado actual: {locationStatus}</Text> 

    </View>
  )
}
