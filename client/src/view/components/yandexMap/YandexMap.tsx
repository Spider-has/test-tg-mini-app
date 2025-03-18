import {
    YMap,
    YMapControls,
    YMapDefaultFeaturesLayer,
    YMapDefaultMarker,
    YMapDefaultSchemeLayer,
    YMapGeolocationControl,
    YMapSearchControl,
} from '../../../lib/ymaps';
import { YMapDefaultMarkerProps } from '@yandex/ymaps3-default-ui-theme';
import { useCallback, useState } from 'react';
import type { LngLat, SearchResponse, YMapLocationRequest } from 'ymaps3';
import './YandexMap.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { setOrderStreet } from '../../store/orderSlice/order';
const YoshkarOlaLocation: YMapLocationRequest = {
    center: [47.8908, 56.6388],
    zoom: 13,
};

const COMMON_LOCATION_PARAMS: YMapLocationRequest = { easing: 'ease-in-out', duration: 200, zoom: 15 };

const fetchGeoObject = async (position: LngLat) => {
    try {
        const res = await fetch(`${GEOCODING_URL}&geocode=${position[0]},${position[1]}`);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        const object = data.response.GeoObjectCollection.featureMember[0]?.GeoObject;
        if (!object) throw new Error(`GeoObject not found`);
        return object;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
};

const GEOCODING_URL =
    'https://geocode-maps.yandex.ru/1.x/?apikey=37fa460c-75d3-49f1-a989-5dece7aa4992&format=json&lang=ru_RU';

export const PlaceSelection = () => {
    const orderStreet = useAppSelector(state => state.order.street);
    const dispatch = useAppDispatch();
    const [location, setLocation] = useState(YoshkarOlaLocation);
    const [markerSource, setMarkerSource] = useState<Omit<YMapDefaultMarkerProps, 'popup'>>();
    const updateMapLocation = useCallback((searchResult: SearchResponse) => {
        console.log(searchResult);
        if (searchResult.length !== 0) {
            let center: LngLat = YoshkarOlaLocation.center;
            const zoom = 17;

            if (searchResult[0].geometry?.coordinates) center = searchResult[0].geometry?.coordinates;
            if (searchResult[0].properties.name) dispatch(setOrderStreet(searchResult[0].properties.name));
            setMarkerSource({ coordinates: center, color: 'red', size: 'normal', iconName: 'fallback' });
            setLocation({ center, zoom, duration: 200 });
        }
    }, []);

    const searchResultHandler = useCallback((searchResult: SearchResponse) => {
        updateMapLocation(searchResult);
    }, []);

    const geoObjectUpdate = useCallback(async (position: LngLat) => {
        const object = await fetchGeoObject(position);
        if (object) {
            console.log(object);
            dispatch(setOrderStreet(object.name));
        }
    }, []);

    const onGeolocatePositionUpdate = useCallback(
        (position: LngLat) => {
            if (position[0] != markerSource?.coordinates[0] && position[1] != markerSource?.coordinates[1]) {
                const zoom = 17;
                setLocation({ center: position, zoom, duration: 200 });
                setMarkerSource({
                    coordinates: position,
                    color: 'red',
                    size: 'normal',
                    iconName: 'fallback',
                });
                geoObjectUpdate(position);
            }
        },
        [markerSource?.coordinates[0], markerSource?.coordinates[1]],
    );
    return (
        <div className={'place-select'}>
            <div className={'place-select__subltitle'}>
                <span>Укажи адрес, куда приехать исполнителю</span>
            </div>
            {/* <div className="place-select__yandex-map-area">
                <YMap location={location}>
                    <YMapDefaultSchemeLayer />
                    <YMapDefaultFeaturesLayer />
                    <YMapControls position="bottom">
                        <YMapSearchControl
                            placeholder={orderStreet ? orderStreet : 'Поиск по карте'}
                            searchResult={searchResultHandler}
                        />
                    </YMapControls>
                    <YMapControls position="right">
                        <YMapGeolocationControl
                            onGeolocatePosition={onGeolocatePositionUpdate}
                            {...COMMON_LOCATION_PARAMS}
                        />
                    </YMapControls>
                    {markerSource && <YMapDefaultMarker {...markerSource} />}
                </YMap>
            </div> */}
        </div>
    );
};
