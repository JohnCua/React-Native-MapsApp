import { use, useEffect, useRef, useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Location } from '../../../infrastructure/interfaces/location';
import { FAB } from '../ui/FAB';
import { useLocationStore } from '../../store/location/useLocationStore';

interface Props {
    showsUserLocation?: boolean;
    initialLocation: Location
}

export const Map = ({ showsUserLocation = true, initialLocation }: Props) => {

    const mapRef = useRef<MapView | null>(null);
    const cameraLocation = useRef<Location>(initialLocation);
    const [isFollowingUser, setIsFollowingUser] = useState(true)
    const [isShowingPolyline, setIsShowingPolyline] = useState(true)

    const { getLocation, lastKnowLocation, watchlocation, clearWatchLocation, userLocationList } = useLocationStore();

    const moveCameraToLocation = (location: Location) => {
        if (!mapRef.current) return;
        mapRef.current.animateCamera({ center: location });
    }

    const moveToCurrentLocation = async () => {
        if (!lastKnowLocation) {
            moveCameraToLocation(initialLocation);
        }

        const location = await getLocation();
        if (!location) return;
        moveCameraToLocation(location)
    }

    useEffect(() => {
        watchlocation();


        return () => {
            clearWatchLocation();
        }

    }, []);

    useEffect(() => {
        if (lastKnowLocation && isFollowingUser) {
            moveCameraToLocation(lastKnowLocation);
        }

    }, [lastKnowLocation, isFollowingUser]);


    return (
        <>
            <MapView
                ref={mapRef}
                showsUserLocation={showsUserLocation}
                provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{ flex: 1 }}
                onTouchStart={() => setIsFollowingUser(false)}
                region={{
                    latitude: cameraLocation.current.latitude,
                    longitude: cameraLocation.current.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}>

                {isShowingPolyline && (
                    <Polyline
                        coordinates={userLocationList}
                        strokeColor='red'
                        strokeWidth={5}
                    />
                )}

                {/* <Marker 
                coordinate={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                }}
                title = 'Test'
                description = 'Test'
                image={ require('../../../assets/marker.png')}
            /> */}

            </MapView>

            <FAB
                iconName={isFollowingUser ? 'eye-outline' : 'eye-off-outline'}
                onPress={() => setIsShowingPolyline(!isShowingPolyline)}
                style={{
                    bottom: 140,
                    right: 20
                }}
            />


            <FAB
                iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
                onPress={() => setIsFollowingUser(!isFollowingUser)}
                style={{
                    bottom: 80,
                    right: 20
                }}
            />


            <FAB
                iconName='compass-outline'
                onPress={moveToCurrentLocation}
                style={{
                    bottom: 20,
                    right: 20
                }}
            />
        </>
    )
}

