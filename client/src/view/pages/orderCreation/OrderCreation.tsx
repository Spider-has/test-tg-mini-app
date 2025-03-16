import { Button } from '../../components/button/Button';
import { AddImageIcon } from '../../static/icons/icons';
import './OrderCreation.scss';
import { TextAreaInput, TextInput } from '../../components/inputs/Inputs';
import { useRef, useState } from 'react';
import 'color-calendar/dist/css/theme-glass.css';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/avatar/Avatar';

import '@yandex/ymaps3-default-ui-theme';
import logo from '../../static/images/logo.png';
import { PlaceSelection } from '../../components/yandexMap/YandexMap';
import { UploadedImage } from '../../components/inputs/ImageUploader';
import { DateSelection, SelectTimeIntervals } from './dateTimeSelection';
import { TopPanel } from '../../components/topPanel/TopPanel';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
    deleteOrderImage,
    OrderCreationFormData,
    setOrderApartmentNumber,
    setOrderDescription,
    setOrderEntrance,
    setOrderExecTimes,
    setOrderImage,
    setOrderTitle,
} from '../../store/orderSlice/order';

type TaskDescriptionProps = {
    subtitle: string;
};

const TaskDescription = (props: TaskDescriptionProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const orderData = useAppSelector(state => state.order);
    const dispatch = useAppDispatch();
    return (
        <div className={'request-task'}>
            <div className={'request-task__task-image-area'}>
                <span>{props.subtitle}</span>
                <div className={'request-task__add-image-icon-area'}>
                    {orderData.images[0] && (
                        <UploadedImage
                            src={orderData.images[0]}
                            alt={'картинка 1'}
                            type={'big'}
                            index={0}
                            OnCloseAction={(i: number) => {
                                dispatch(deleteOrderImage(i));
                            }}
                        />
                    )}
                    {orderData.images.length > 1 && (
                        <div className={'request-task__small-image-wrapper'}>
                            {orderData.images[1] && (
                                <UploadedImage
                                    src={orderData.images[1]}
                                    alt={'картинка 2'}
                                    type={'small'}
                                    index={1}
                                    OnCloseAction={(i: number) => {
                                        dispatch(deleteOrderImage(i));
                                    }}
                                />
                            )}
                            {orderData.images[2] && (
                                <UploadedImage
                                    src={orderData.images[2]}
                                    alt={'картинка 3'}
                                    type={'small'}
                                    index={2}
                                    OnCloseAction={(i: number) => {
                                        dispatch(deleteOrderImage(i));
                                    }}
                                />
                            )}
                        </div>
                    )}
                    {orderData.images.length < 3 && (
                        <label>
                            <AddImageIcon />
                            <input
                                onChange={() => {
                                    const reader = new FileReader();
                                    reader.onload = event => {
                                        if (event.target?.result) {
                                            const href = event.target.result as string;
                                            dispatch(setOrderImage(href));
                                        }
                                    };
                                    if (inputRef.current?.files)
                                        reader.readAsDataURL(inputRef.current?.files[0]);
                                }}
                                ref={inputRef}
                                type="file"
                                accept="image/png, image/jpeg"
                            />
                        </label>
                    )}
                </div>
            </div>
            <div className={'request-task__task-header-area'}>
                <span>Опиши суть задачи несколькими словами</span>
                <TextInput
                    onInputHandler={(inpRef: React.RefObject<HTMLInputElement>) => {
                        if (inpRef.current) {
                            dispatch(setOrderTitle(inpRef.current.value));
                        }
                    }}
                    placeholder={'Суть задачи'}
                    maxLength={40}
                    value={orderData.title}
                />
            </div>
            <div className={'request-task__task-description-area'}>
                <span>Опиши свою задачу подробнее</span>
                <TextAreaInput
                    onInputHandler={(inpRef: React.RefObject<HTMLTextAreaElement>) => {
                        if (inpRef.current) {
                            dispatch(setOrderDescription(inpRef.current.value));
                        }
                    }}
                    placeholder="Подробное описание задачи"
                    value={orderData.description}
                />
            </div>
        </div>
    );
};

const timeIntervalToDate = (intervals: string[]): TimeDurations[] => {
    const copyIntervals = [...intervals];
    const dates: TimeDurations[] = [];
    copyIntervals.forEach(interval => {
        const times = interval.split('-');
        const start = new Date();
        start.setHours(Number(times[0].split(':')[0]));
        const end = new Date();
        end.setHours(Number(times[1].split(':')[0]));
        dates.push({ start: start, end: end });
    });
    return dates;
};

const FinalStage = () => {
    const orderData = useAppSelector(state => state.order);
    const dispatch = useAppDispatch();
    return (
        <div className={'creation-final-stage'}>
            <div className={'creation-final-stage__title'}>Проверь данные заказа и измени их, если нужно</div>
            <TaskDescription subtitle={'Добавь 1-3 фотографии своей задачи'} />
            <div className={'creation-final-stage__order-date'}>
                <SelectTimeIntervals
                    intervals={orderData.executionTimes}
                    setTimeIntervals={(times: string[]) => {
                        dispatch(setOrderExecTimes(times));
                    }}
                    subtitle="Желаемое время выполнения задачи"
                />
            </div>
            <div className={'creation-final-stage__order-place'}>
                <span>Место выполнения заказа</span>
            </div>
        </div>
    );
};

type TimeDurations = {
    start: Date;
    end: Date;
};

const sendAllDataHandler = (OrderData: OrderCreationFormData) => {
    const user_id = 0;
    const client_username = '';
    const adress = `${OrderData.street}, подъезд: ${OrderData.entrance}, квартира: ${OrderData.apartmentNumber}`;
    const times: TimeDurations[] = timeIntervalToDate(OrderData.executionTimes);
    console.log(
        fetchNewOrder(
            toOrderData(
                user_id,
                client_username,
                OrderData.images,
                OrderData.title,
                OrderData.description,
                adress,
                OrderData.executionDate,
                times,
            ),
        ),
    );
};

export const RequestCreation = () => {
    const orderData = useAppSelector(state => state.order);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [sliderState, setSliderState] = useState(0);

    const slider = [
        <TaskDescription key={0} subtitle={'Добавь 1-3 фотографии своей задачи'} />,
        <DateSelection key={1} />,
        <PlaceSelection key={2} />,
        <FinalStage key={3} />,
    ];
    const buttonGapClass = sliderState == slider.length - 1 ? 'navigation-buttons_small-gap' : '';
    const nextButtonDisabled = () => {
        switch (sliderState) {
            case 0:
                return orderData.title === '';
            case 2:
                return orderData.street == '';
            default:
                return false;
        }
    };
    return (
        <div className={'request-creation'}>
            <PageMainAreaWrapper header={'Создание заявки'}>{slider[sliderState]}</PageMainAreaWrapper>
            {sliderState === 2 && (
                <div className={'place-data'}>
                    <div className={'place-data__input-area'}>
                        <span>Город, улица и дом</span>
                        {/* <TextInput  placeholder={'Введите адрес'} maxLength={100} /> */}
                    </div>
                    <div className={'place-data__twice-input-area'}>
                        <div className={'place-data__input-area'}>
                            <span>Подъезд</span>
                            <TextInput
                                onInputHandler={(inpRef: React.RefObject<HTMLInputElement>) => {
                                    if (inpRef.current) {
                                        dispatch(setOrderEntrance(inpRef.current.value));
                                    }
                                }}
                                placeholder={'Подъезд'}
                                maxLength={20}
                                value={orderData.entrance}
                            />
                        </div>
                        <div className={'place-data__input-area'}>
                            <span>Квартира</span>
                            <TextInput
                                onInputHandler={(inpRef: React.RefObject<HTMLInputElement>) => {
                                    if (inpRef.current) {
                                        dispatch(setOrderApartmentNumber(inpRef.current.value));
                                    }
                                }}
                                placeholder={'Квартира'}
                                maxLength={20}
                                value={orderData.apartmentNumber}
                            />
                        </div>
                    </div>
                    {/* <div className={'place-data__input-area'}>
                        <span>Комментарий исполнителю</span>
                        <TextInput placeholder={'Дополнительная информация'} maxLength={100} />
                    </div> */}
                </div>
            )}
            <BottomNavigationPanel>
                <div className={`navigation-buttons ${buttonGapClass}`}>
                    {sliderState !== slider.length - 1 && (
                        <>
                            <div>
                                <Button
                                    onClick={() => {
                                        if (sliderState - 1 >= 0) setSliderState(sliderState - 1);
                                        else navigate('/start');
                                    }}
                                    text={'Назад'}
                                    bgColor="gray"
                                />
                            </div>
                            <div>
                                <Button
                                    onClick={() => {
                                        if (sliderState + 1 < slider.length) setSliderState(sliderState + 1);
                                    }}
                                    text={'Далее'}
                                    bgColor="green"
                                    isDisabled={nextButtonDisabled()}
                                />
                            </div>
                        </>
                    )}
                    {sliderState === slider.length - 1 && (
                        <>
                            <div>
                                <Button
                                    onClick={() => {
                                        navigate('/start');
                                    }}
                                    text={'Отменить'}
                                    bgColor="red"
                                />
                            </div>
                            <div>
                                <Button
                                    onClick={() => {
                                        sendAllDataHandler(orderData);
                                    }}
                                    bgColor="green"
                                    text={'Подтвердить'}
                                />
                            </div>
                        </>
                    )}
                </div>
            </BottomNavigationPanel>
        </div>
    );
};

export const PageMainAreaWrapper = (props: { children: React.ReactNode; header: string }) => {
    return (
        <div className={'page-main-area'}>
            <div className={'page-main-area__top-panel-wrapper'}>
                <div className={'page-main-area__top-panel-area'}>
                    <TopPanel>
                        <div className={'small-logo-wrapper'}>
                            <img src={logo} alt="лого" />
                        </div>
                        <Avatar link="" path="" altText="" />
                    </TopPanel>
                    <h1>{props.header}</h1>
                </div>
            </div>
            <div className={'page-main-area__main-content-area'}>{props.children}</div>
        </div>
    );
};

export const BottomNavigationPanel = (props: { children: React.ReactNode }) => {
    return (
        <div className={'bottom-navigation-area-container '}>
            <div className={'bottom-navigation-area-container__elements-area'}>{props.children}</div>
        </div>
    );
};

const NEW_ORDER_URL = 'Nikita-bot-server-api-order-creation';

type OrderData = {
    tg_chat_id: number;
    client_username: string;
    images: string[];
    title: string;
    description: string;
    address: string;
    execution_date: Date;
    execution_times: TimeDurations[];
};

const toOrderData = (
    tg_chat_id: number,
    client_username: string,
    images: string[],
    title: string,
    description: string,
    address: string,
    execution_date: Date,
    execution_times: TimeDurations[],
): OrderData => {
    return {
        tg_chat_id: tg_chat_id,
        client_username: client_username,
        images: images,
        title: title,
        description: description,
        address: address,
        execution_date: execution_date,
        execution_times: execution_times,
    };
};

const fetchNewOrder = async (data: OrderData) => {
    try {
        const response = await fetch(NEW_ORDER_URL, {
            method: 'post',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error while sendind order data! Status: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
