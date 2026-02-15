import { getCurrentLocation, clearWatchLocation, watchCurrentLocation } from '../../../actions/location/location';
import { Location } from "../../../infrastructure/interfaces/location";
import { create } from 'zustand';




interface LocationState {
    lastKnowLocation: Location | null;
    userLocationList: Location[];
    watchId: number | null;


    getLocation: () => Promise< Location | null >;
    watchlocation: () => void;
    clearWatchLocation: () => void;
}

export const useLocationStore =  create< LocationState >()( ( set, get ) => ({

    lastKnowLocation: null,
    userLocationList: [],
    watchId: null,

    getLocation: async() => {
        const location = await getCurrentLocation();
        set({ lastKnowLocation: location });
        return location;
    },

    watchlocation: () => {
        const watchId = get().watchId;
        if( watchId !== null ) {
            get().clearWatchLocation();
        }

        const id = watchCurrentLocation( (location) => {
            set({
                lastKnowLocation: location,
                userLocationList: [...get().userLocationList, location]
            })
        } );

        set({ watchId: id })
    },

    clearWatchLocation: () => {
        const watchId = get().watchId;
        if( watchId !== null ) {
            clearWatchLocation(watchId);
        }
    }



} ))