import { Button } from '../../components/button/Button';
import { AddImageIcon, ChangeThemeIcon, CloseIcon } from '../../static/icons/icons';
import './RequestCreation.scss';
import { OptionsList, OptionsProps, TextAreaInput, TextInput } from '../../components/inputs/Inputs';
import { useCallback, useEffect, useRef, useState } from 'react';
import Calendar from 'color-calendar';
import 'color-calendar/dist/css/theme-glass.css';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/avatar/Avatar';
import type { LngLat, SearchResponse, YMapLocationRequest } from 'ymaps3';
import '@yandex/ymaps3-default-ui-theme';
import logo from '../../static/images/logo.png';

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

const TaskDescription = () => {
    const [imagesData, setImagesData] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div className={'request-task'}>
            <div className={'request-task__task-image-area'}>
                <span>Добавь 1-3 фотографии своей задачи</span>
                <div className={'request-task__add-image-icon-area'}>
                    {imagesData[0] && (
                        <div className={'request-task__big-image-wrapper'}>
                            <div className={'task-image task-image_big'}>
                                <img src={imagesData[0]} alt={`изображение 0`} />
                                <div
                                    className={'task-image__close-icon'}
                                    onClick={() => {
                                        const newImages = [...imagesData];
                                        newImages.splice(0, 1);
                                        setImagesData(newImages);
                                    }}
                                >
                                    <CloseIcon />
                                </div>
                            </div>
                        </div>
                    )}
                    {imagesData[1] && (
                        <div className={'request-task__small-image-wrapper'}>
                            <div className={'task-image task-image_small'}>
                                <img src={imagesData[1]} alt={`изображение 0`} />
                                <div
                                    className={'task-image__close-icon'}
                                    onClick={() => {
                                        const newImages = [...imagesData];
                                        newImages.splice(1, 1);
                                        setImagesData(newImages);
                                    }}
                                >
                                    <CloseIcon />
                                </div>
                            </div>
                            {imagesData[2] && (
                                <div className={'task-image task-image_small'}>
                                    <img src={imagesData[2]} alt={`изображение 0`} />
                                    <div
                                        className={'task-image__close-icon'}
                                        onClick={() => {
                                            const newImages = [...imagesData];
                                            newImages.splice(2, 1);
                                            setImagesData(newImages);
                                        }}
                                    >
                                        <CloseIcon />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <label>
                        {imagesData.length < 3 && <AddImageIcon />}
                        {imagesData.length < 3 && (
                            <input
                                onChange={() => {
                                    const reader = new FileReader();
                                    reader.onload = event => {
                                        if (event.target?.result) {
                                            const href = event.target.result as string;
                                            setImagesData(images => [...images, href]);
                                            console.log(imagesData);
                                        }
                                    };
                                    if (inputRef.current?.files)
                                        reader.readAsDataURL(inputRef.current?.files[0]);
                                }}
                                ref={inputRef}
                                type="file"
                                accept="image/png, image/jpeg"
                            />
                        )}
                    </label>
                </div>
            </div>
            <div className={'request-task__task-header-area'}>
                <span>Опиши суть задачи несколькими словами</span>
                <TextInput maxLength={40} placeholder={'Заголовок задачи'} />
            </div>
            <div className={'request-task__task-description-area'}>
                <span>Опиши свою задачу подробнее</span>
                <TextAreaInput placeholder="Подробное описание задачи" />
            </div>
        </div>
    );
};

const dayTimeOptionsList: OptionsProps = {
    checkboxes: [
        { text: '8:00 - 10:00' },
        { text: '10:00 - 12:00' },
        { text: '12:00 - 14:00' },
        { text: '14:00 - 16:00' },
        { text: '16:00 - 18:00' },
        { text: '20:00 - 22:00' },
    ],
};

const DateSelection = () => {
    useEffect(() => {
        new Calendar({
            id: '#color-calendar',
            theme: 'glass',
            weekdayType: 'long-upper',
            startWeekday: 1,
            fontFamilyHeader: "'Lato', sans-serif",
            fontFamilyBody: "'Lato', sans-serif",
            fontFamilyWeekdays: "'Lato', sans-serif",
            monthDisplayType: 'long',
            primaryColor: '#06D6A0',
            headerColor: '#000000',
            headerBackgroundColor: '#FFFFFF',
            calendarSize: 'small',
            customWeekdayValues: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            disableMonthYearPickers: true,
            disableMonthArrowClick: true,
            dropShadow: 'none',
            dateChanged: (currentDate: unknown, events: unknown) => {
                console.log('date change', currentDate, events);
            },
            monthChanged: (currentDate: unknown, events: unknown) => {
                console.log('month change', currentDate, events);
            },
        });
    }, []);
    return (
        <div className={'date-select'}>
            <div className={'date-select__calendar-area'}>
                <span>Выбери желательную дату выполнения задачи</span>
                <div className={'date-select__calendar-wrapper'}>
                    <div id="color-calendar"></div>
                </div>
            </div>
            <div className={'date-select__time-select-area'}>
                <span>Выбери желательное время выполнения задачи</span>
                <OptionsList {...dayTimeOptionsList} />
            </div>
        </div>
    );
};

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

export const GEOCODING_URL =
    'https://geocode-maps.yandex.ru/1.x/?apikey=37fa460c-75d3-49f1-a989-5dece7aa4992&format=json&lang=ru_RU';

const PlaceSelection = () => {
    const [location, setLocation] = useState(YoshkarOlaLocation);
    const [markerSource, setMarkerSource] = useState<Omit<YMapDefaultMarkerProps, 'popup'>>();
    const [placeName, setPlaceName] = useState('');
    const updateMapLocation = useCallback((searchResult: SearchResponse) => {
        console.log(searchResult);
        if (searchResult.length !== 0) {
            let center: LngLat = YoshkarOlaLocation.center;
            const zoom = 17;

            if (searchResult[0].geometry?.coordinates) center = searchResult[0].geometry?.coordinates;
            if (searchResult[0].properties.name) setPlaceName(searchResult[0].properties.name);
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
            setPlaceName(object.name);
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
                <span>Выбери место, где нужно выполнить твою задачу</span>
            </div>
            <div className="place-select__yandex-map-area">
                <YMap location={location}>
                    <YMapDefaultSchemeLayer />
                    <YMapDefaultFeaturesLayer />
                    <YMapControls position="bottom">
                        <YMapSearchControl
                            placeholder={placeName ? placeName : 'Поиск по карте'}
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
            </div>
            {/*  <div className={'request-creation__place-select-buttons'}>
                <div>
                    <Button
                        onClick={() => 0}
                        text={'Подставить моё местоположение'}
                        borderRound="small"
                        textSize="small"
                    />
                </div>
                <div>
                    <Button
                        onClick={() => 0}
                        text={'Выбрать место на карте'}
                        borderRound="small"
                        textSize="small"
                    />
                </div> 
            </div>*/}
        </div>
    );
};

export const TopPanel = (props: { children: React.ReactNode[] }) => {
    return <div className="top-panel">{props.children}</div>;
};

const FinalStage = () => {
    return (
        <div className={'creation-final-stage'}>
            <div className={'creation-final-stage__title'}></div>
            <div className={'creation-final-stage__photo-area'}></div>
            <div className={'creation-final-stage__order-header'}></div>
            <div className={'creation-final-stage__order-desctiption'}></div>
            <div className={'creation-final-stage__order-date'}></div>
            <div className={'creation-final-stage__order-daytime'}></div>
            <div className={'creation-final-stage__order-place'}></div>
        </div>
    );
};

export const RequestCreation = () => {
    const navigate = useNavigate();
    const [sliderState, setSliderState] = useState(0);
    const slider = [<TaskDescription key={0} />, <DateSelection key={1} />, <PlaceSelection key={2} />];
    return (
        <div className={'request-creation'}>
            <div className={'request-creation__input-area'}>
                <div className={'request-creation__top-panel-wrapper'}>
                    <div className={'request-creation__top-panel-area'}>
                        <TopPanel>
                            <ChangeThemeIcon />
                            <div className={'small-logo-wrapper'}>
                                <img src={logo} alt="лого" />
                            </div>
                            <Avatar link="" path="" altText="" />
                        </TopPanel>
                        <h1>Создание заявки</h1>
                    </div>
                </div>
                <div className={'request-creation__stage-area'}>{slider[sliderState]}</div>
            </div>
            <div className={'request-creation__pages-navigation-area'}>
                <div className={'navigation-buttons'}>
                    <div>
                        <Button
                            onClick={() => {
                                if (sliderState - 1 >= 0) setSliderState(sliderState - 1);
                                else navigate('/start');
                            }}
                            text={'Назад'}
                            borderRound="normal"
                            textSize="normal"
                            bgColor="gray"
                        />
                    </div>
                    <div>
                        <Button
                            onClick={() => {
                                if (sliderState + 1 < slider.length) setSliderState(sliderState + 1);
                            }}
                            text={'Далее'}
                            borderRound="normal"
                            textSize="normal"
                            bgColor="green"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
