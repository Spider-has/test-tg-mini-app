import { Button } from '../../components/button/Button';
import { AddImageIcon } from '../../static/icons/icons';
import './OrderCreation.scss';
import { TextAreaInput, TextInput } from '../../components/inputs/Inputs';
import { useCallback, useRef, useState } from 'react';
import 'color-calendar/dist/css/theme-glass.css';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/avatar/Avatar';

import '@yandex/ymaps3-default-ui-theme';
import logo from '../../static/images/logo.png';
import { PlaceSelection } from '../../components/yandexMap/YandexMap';
import { UploadedImage } from '../../components/inputs/ImageUploader';
import { DateSelection, SelectTimeIntervals } from './dateTimeSelection';
import { TopPanel } from '../../components/topPanel/TopPanel';

type TaskDescriptionProps = {
    imagesData: string[];
    header: string;
    description: string;
    addImageHandler: (image: string) => void;
    onImageCloseHandler: (i: number) => void;
    setHeaderHandler: (header: string) => void;
    setDescriptionHandler: (description: string) => void;
    subtitle: string;
};

const TaskDescription = (props: TaskDescriptionProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div className={'request-task'}>
            <div className={'request-task__task-image-area'}>
                <span>{props.subtitle}</span>
                <div className={'request-task__add-image-icon-area'}>
                    {props.imagesData[0] && (
                        <UploadedImage
                            src={props.imagesData[0]}
                            alt={'картинка 1'}
                            type={'big'}
                            index={0}
                            OnCloseAction={props.onImageCloseHandler}
                        />
                    )}
                    {props.imagesData.length > 1 && (
                        <div className={'request-task__small-image-wrapper'}>
                            {props.imagesData[1] && (
                                <UploadedImage
                                    src={props.imagesData[1]}
                                    alt={'картинка 2'}
                                    type={'small'}
                                    index={1}
                                    OnCloseAction={props.onImageCloseHandler}
                                />
                            )}
                            {props.imagesData[2] && (
                                <UploadedImage
                                    src={props.imagesData[2]}
                                    alt={'картинка 3'}
                                    type={'small'}
                                    index={2}
                                    OnCloseAction={props.onImageCloseHandler}
                                />
                            )}
                        </div>
                    )}
                    {props.imagesData.length < 3 && (
                        <label>
                            <AddImageIcon />
                            <input
                                onChange={() => {
                                    const reader = new FileReader();
                                    reader.onload = event => {
                                        if (event.target?.result) {
                                            const href = event.target.result as string;
                                            props.addImageHandler(href);
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
                            props.setHeaderHandler(inpRef.current.value);
                        }
                    }}
                    placeholder={'Суть задачи'}
                    maxLength={40}
                    value={props.header}
                />
            </div>
            <div className={'request-task__task-description-area'}>
                <span>Опиши свою задачу подробнее</span>
                <TextAreaInput
                    onInputHandler={(inpRef: React.RefObject<HTMLTextAreaElement>) => {
                        if (inpRef.current) {
                            props.setDescriptionHandler(inpRef.current.value);
                        }
                    }}
                    placeholder="Подробное описание задачи"
                    value={props.description}
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

type FinalStageProps = OrderCreationFormData & {
    addImageHandler: (image: string) => void;
    onImageCloseHandler: (i: number) => void;
    setHeaderHandler: (header: string) => void;
    setDescriptionHandler: (description: string) => void;
    setTimeIntervals: (times: string[]) => void;
};

const FinalStage = (props: FinalStageProps) => {
    return (
        <div className={'creation-final-stage'}>
            <div className={'creation-final-stage__title'}>Проверь данные заказа и измени их, если нужно</div>
            <TaskDescription
                imagesData={props.images}
                header={props.title}
                description={props.description}
                addImageHandler={props.addImageHandler}
                onImageCloseHandler={props.onImageCloseHandler}
                setHeaderHandler={props.setHeaderHandler}
                setDescriptionHandler={props.setDescriptionHandler}
                subtitle={'Фотографии заказа'}
            />
            <div className={'creation-final-stage__order-date'}>
                <SelectTimeIntervals
                    date={props.execution_date}
                    intervals={props.execution_times}
                    setTimeIntervals={props.setTimeIntervals}
                    subtitle="Желаемое время выполнения задачи"
                />
            </div>
            <div className={'creation-final-stage__order-place'}>
                <span>Место выполнения заказа</span>
            </div>
        </div>
    );
};

type OrderCreationFormData = {
    images: string[];
    title: string;
    description: string;
    street: string;
    entrance: string;
    apartmentNumber: string;
    execution_date: Date;
    execution_times: string[];
};

type TimeDurations = {
    start: Date;
    end: Date;
};

const defaultOrderData: OrderCreationFormData = {
    images: [],
    title: '',
    description: '',
    street: '',
    entrance: '',
    apartmentNumber: '',
    execution_date: new Date(),
    execution_times: [],
};

const sendAllDataHandler = (OrderData: OrderCreationFormData) => {
    const user_id = 0;
    const client_username = '';
    const adress = `${OrderData.street}, подъезд: ${OrderData.entrance}, квартира: ${OrderData.apartmentNumber}`;
    const times: TimeDurations[] = timeIntervalToDate(OrderData.execution_times);
    console.log(
        fetchNewOrder(
            toOrderData(
                user_id,
                client_username,
                OrderData.images,
                OrderData.title,
                OrderData.description,
                adress,
                OrderData.execution_date,
                times,
            ),
        ),
    );
};

export const RequestCreation = () => {
    const navigate = useNavigate();
    const [sliderState, setSliderState] = useState(0);
    const [OrderData, setOrderData] = useState<OrderCreationFormData>(defaultOrderData);

    const setOrderHeader = useCallback((header: string) => {
        setOrderData(order => {
            return { ...order, title: header };
        });
    }, []);
    const setOrderDescription = useCallback((description: string) => {
        setOrderData(order => {
            return { ...order, description: description };
        });
    }, []);
    const setOrderImage = useCallback((image: string) => {
        setOrderData(order => {
            return { ...order, images: [...order.images, image] };
        });
    }, []);
    const deleteOrderImage = useCallback((i: number) => {
        setOrderData(order => {
            return { ...order, images: order.images.toSpliced(i, 1) };
        });
    }, []);
    const setOrderStreet = useCallback((street: string) => {
        setOrderData(order => {
            return { ...order, street: street };
        });
    }, []);
    const setOrderApartmentNumber = useCallback((apartmentNumber: string) => {
        setOrderData(order => {
            return { ...order, apartmentNumber: apartmentNumber };
        });
    }, []);
    const setOrderEntrance = useCallback((entrance: string) => {
        setOrderData(order => {
            return { ...order, entrance: entrance };
        });
    }, []);
    const setOrderDate = useCallback((date: Date) => {
        setOrderData(order => {
            return { ...order, execution_date: date };
        });
    }, []);
    const setOrderDurTimes = useCallback((times: string[]) => {
        setOrderData(order => {
            return { ...order, execution_times: times };
        });
    }, []);

    const slider = [
        <TaskDescription
            setDescriptionHandler={setOrderDescription}
            setHeaderHandler={setOrderHeader}
            imagesData={OrderData.images}
            addImageHandler={setOrderImage}
            onImageCloseHandler={deleteOrderImage}
            key={0}
            header={OrderData.title}
            description={OrderData.description}
            subtitle="Добавь 1-3 фотографии своей задачи"
        />,
        <DateSelection
            key={1}
            date={OrderData.execution_date}
            intervals={OrderData.execution_times}
            setDateHandler={setOrderDate}
            setTimeIntervals={setOrderDurTimes}
        />,
        <PlaceSelection street={OrderData.street} setStreet={setOrderStreet} key={2} />,
        <FinalStage
            setTimeIntervals={setOrderDurTimes}
            key={3}
            {...OrderData}
            addImageHandler={setOrderImage}
            onImageCloseHandler={deleteOrderImage}
            setHeaderHandler={setOrderHeader}
            setDescriptionHandler={setOrderDescription}
        />,
    ];
    const buttonGapClass = sliderState == slider.length - 1 ? 'navigation-buttons_small-gap' : '';
    console.log(OrderData);
    const nextButtonDisabled = () => {
        switch (sliderState) {
            case 0:
                return OrderData.title == '';
            case 2:
                return OrderData.street == '';
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
                                        setOrderEntrance(inpRef.current.value);
                                    }
                                }}
                                placeholder={'Подъезд'}
                                maxLength={20}
                                value={OrderData.entrance}
                            />
                        </div>
                        <div className={'place-data__input-area'}>
                            <span>Квартира</span>
                            <TextInput
                                onInputHandler={(inpRef: React.RefObject<HTMLInputElement>) => {
                                    if (inpRef.current) {
                                        setOrderApartmentNumber(inpRef.current.value);
                                    }
                                }}
                                placeholder={'Квартира'}
                                maxLength={20}
                                value={OrderData.apartmentNumber}
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
                                        sendAllDataHandler(OrderData);
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
