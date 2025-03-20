import { Button } from '../../components/button/Button';
import { AddImageIcon } from '../../static/icons/icons';
import './OrderCreation.scss';
import { TextAreaInput, TextInput } from '../../components/inputs/Inputs';
import { useEffect, useMemo, useRef, useState } from 'react';
import 'color-calendar/dist/css/theme-glass.css';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/avatar/Avatar';

import logo from '../../static/images/logo.png';
import { PlaceInputs, PlaceSelection } from '../../components/yandexMap/YandexMap';
import { FullSizeImage, UploadedImage } from '../../components/inputs/ImageUploader';
import { DateSelection, SelectTimeIntervals } from './dateTimeSelection';
import { TopPanel } from '../../components/topPanel/TopPanel';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
    clearAllData,
    deleteOrderImage,
    OrderCreationFormData,
    setImageSelected,
    setOrderDescription,
    setOrderExecTimes,
    setOrderImage,
    setOrderTitle,
    setSelectedImageSrc,
} from '../../store/orderCreationSlice/orderCreation';
import { ImagePopup, TextFieldPopup } from '../../components/popup/Popup';
import { ErrorMessage } from '../../components/errorMessage/ErrorMessage';
import { ORDER_LIST_URL, WELCOME_PAGE_URL } from '../../../App';
import { fetchOrders } from '../../store/orderListSlice/orderList';

const UploadTaskImagesArea = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const orderImages = useAppSelector(state => state.order.images);
    const dispatch = useAppDispatch();
    return (
        <div className={'request-task__add-image-icon-area'}>
            {orderImages[0] && (
                <UploadedImage
                    src={orderImages[0]}
                    alt={'картинка 1'}
                    type={'big'}
                    index={0}
                    onFullSizeAction={() => {
                        dispatch(setImageSelected(true));
                        dispatch(setSelectedImageSrc(orderImages[0]));
                    }}
                    OnCloseAction={(i: number) => {
                        dispatch(deleteOrderImage(i));
                    }}
                />
            )}
            {orderImages.length > 1 && (
                <div className={'request-task__small-image-wrapper'}>
                    {orderImages[1] && (
                        <UploadedImage
                            src={orderImages[1]}
                            alt={'картинка 2'}
                            type={'small'}
                            index={1}
                            onFullSizeAction={() => {
                                dispatch(setImageSelected(true));
                                dispatch(setSelectedImageSrc(orderImages[1]));
                            }}
                            OnCloseAction={(i: number) => {
                                dispatch(deleteOrderImage(i));
                            }}
                        />
                    )}
                    {orderImages[2] && (
                        <UploadedImage
                            src={orderImages[2]}
                            alt={'картинка 3'}
                            type={'small'}
                            index={2}
                            onFullSizeAction={() => {
                                dispatch(setImageSelected(true));
                                dispatch(setSelectedImageSrc(orderImages[2]));
                            }}
                            OnCloseAction={(i: number) => {
                                dispatch(deleteOrderImage(i));
                            }}
                        />
                    )}
                </div>
            )}
            {orderImages.length < 3 && (
                <label className="request-task__add-image-icon">
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
                            if (inputRef.current?.files) reader.readAsDataURL(inputRef.current?.files[0]);
                        }}
                        ref={inputRef}
                        type="file"
                        accept="image/png, image/jpeg"
                        tabIndex={-1}
                    />
                </label>
            )}
        </div>
    );
};

type TaskMainDataProps = {
    subtitle: string;
    checkValidity: boolean;
};

const TaskMainData = (props: TaskMainDataProps) => {
    const title = useAppSelector(state => state.order.title);
    const description = useAppSelector(state => state.order.description);
    const dispatch = useAppDispatch();
    const titleInputValid = useMemo(() => {
        if (props.checkValidity && title === '') return false;
        return true;
    }, [props.checkValidity, title]);
    // const descriptionInputValid = useMemo(() => {
    //     if (props.checkValidity && description === '') return false;
    //     return true;
    // }, [props.checkValidity, description]);
    const shownMessage = useMemo(() => {
        return !titleInputValid;
    }, [titleInputValid]);
    return (
        <div className={'request-task'}>
            <div className={'request-task__task-image-area'}>
                <span>{props.subtitle}</span>
                <UploadTaskImagesArea />
            </div>
            <div className={'request-task__task-header-area'}>
                <span>Опиши суть задачи несколькими словами</span>
                <TextInput
                    onInputHandler={(value: string) => {
                        dispatch(setOrderTitle(value));
                    }}
                    placeholder={'Суть задачи'}
                    maxLength={40}
                    value={title}
                    isNotValid={!titleInputValid}
                />
            </div>
            <div className={'request-task__task-description-area'}>
                <span>Опиши свою задачу подробнее</span>
                <TextAreaInput
                    onInputHandler={(value: string) => {
                        dispatch(setOrderDescription(value));
                    }}
                    placeholder="Подробное описание задачи"
                    value={description}
                />
            </div>
            <div className={'request-task__error-wrapper'}>
                <ErrorMessage shown={shownMessage} text={'Поля не должны быть пустыми'} />
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
        start.setUTCHours(Number(times[0].split(':')[0]));
        start.setMinutes(0, 0, 0);
        const end = new Date();
        end.setUTCHours(Number(times[1].split(':')[0]));
        end.setMinutes(0, 0, 0);
        dates.push({ start: start.toISOString(), end: end.toISOString() });
    });
    console.log(dates);
    return dates;
};

type FinalStageProps = {
    checkValidity: boolean;
};

const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
};

const FinalStage = (props: FinalStageProps) => {
    const orderData = useAppSelector(state => state.order);
    const dispatch = useAppDispatch();
    return (
        <div className={'creation-final-stage'}>
            <div className={'creation-final-stage__title'}>Проверь данные заказа и измени их, если нужно</div>
            <TaskMainData
                subtitle={'Добавь 1-3 фотографии своей задачи'}
                checkValidity={props.checkValidity}
            />
            <div className={'creation-final-stage__order-date'}>
                <SelectTimeIntervals
                    validityCheck={props.checkValidity}
                    intervals={orderData.executionTimes}
                    setTimeIntervals={(times: string[]) => {
                        dispatch(setOrderExecTimes(times));
                    }}
                    subtitle={`Желаемое время выполнения задачи на ${new Date(
                        orderData.executionDate,
                    ).toLocaleDateString('ru', options)}`}
                />
            </div>
            <div className={'creation-final-stage__order-place'}>
                <span>Место выполнения заказа</span>
                <PlaceInputs checkValidity={props.checkValidity} />
            </div>
        </div>
    );
};

type TimeDurations = {
    start: string;
    end: string;
};

const sendAllDataHandler = (userId: number, client_userName: string, OrderData: OrderCreationFormData) => {
    const user_id = userId;
    const client_username = client_userName;
    const adress = `${OrderData.street}, подъезд: ${OrderData.entrance}, квартира: ${OrderData.apartmentNumber}`;
    const times: TimeDurations[] = timeIntervalToDate(OrderData.executionTimes);
    console.log(
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
    );
    return fetchNewOrder(
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
    );
};

export const RequestCreation = () => {
    const orderData = useAppSelector(state => state.order);
    const userData = useAppSelector(state => state.user);
    const navigate = useNavigate();
    const [sliderState, setSliderState] = useState(0);
    const [exitPopupOpen, setExitPopupOpen] = useState(false);
    const [successPopupOpen, setSuccessPopupOpen] = useState(false);
    const dispatch = useAppDispatch();
    const nextButtonDisabled = () => {
        switch (sliderState) {
            case 0:
                return orderData.title === '';
            case 1:
                return orderData.executionTimes.length === 0;
            case 2:
                return orderData.street == '';
            case 3:
                return (
                    orderData.title === '' || orderData.executionTimes.length === 0 || orderData.street === ''
                );
            default:
                return false;
        }
    };
    const [validityCheck, setValidityCheck] = useState(false);
    useEffect(() => {
        setValidityCheck(false);
    }, [sliderState]);
    useEffect(() => {
        document.addEventListener('keydown', function (evt) {
            if (evt.code === 'Tab') {
                evt.preventDefault();
            }
        });
    }, []);

    return (
        <div className={'request-creation'}>
            <PageMainAreaWrapper
                onAvatarClick={() => {
                    setExitPopupOpen(true);
                }}
                header={'Создание заявки'}
            >
                <Swiper
                    onNextSlideSwipe={() => {
                        setSliderState(state => state + 1);
                    }}
                    onPreviousSlideSwipe={() => {
                        setSliderState(state => state - 1);
                    }}
                    currentStage={sliderState}
                    canSwipeToNext={!nextButtonDisabled()}
                    onCantSwipeToNext={() => {
                        setValidityCheck(true);
                    }}
                >
                    <TaskMainData
                        key={0}
                        subtitle={'Добавь 1-3 фотографии своей задачи'}
                        checkValidity={validityCheck}
                    />
                    <DateSelection validityCheck={validityCheck} key={1} />
                    <PlaceSelection checkValidity={validityCheck} key={2} />
                    <FinalStage checkValidity={validityCheck} key={3} />
                </Swiper>
            </PageMainAreaWrapper>
            <BottomNavigationPanel>
                <NavigationButtonsArea gapType={sliderState == 3 ? 'small' : 'normal'}>
                    {sliderState !== 3 && (
                        <>
                            <Button
                                onClick={() => {
                                    if (sliderState - 1 >= 0) setSliderState(sliderState - 1);
                                    else setExitPopupOpen(true);
                                }}
                                text={'Назад'}
                                bgColor="gray"
                            />
                            <Button
                                onClick={() => {
                                    if (sliderState + 1 < 4) setSliderState(sliderState + 1);
                                }}
                                onDisabledClick={() => {
                                    setValidityCheck(true);
                                }}
                                text={'Далее'}
                                bgColor="green"
                                isDisabled={nextButtonDisabled()}
                            />
                        </>
                    )}
                    {sliderState === 3 && (
                        <>
                            <Button
                                onClick={() => {
                                    setExitPopupOpen(true);
                                }}
                                text={'Отменить'}
                                bgColor="red"
                            />
                            <Button
                                onClick={() => {
                                    sendAllDataHandler(userData.chatId, userData.userName, orderData).then(
                                        res => {
                                            if (res?.status === 201) dispatch(fetchOrders(userData.chatId));
                                        },
                                    );
                                    setSuccessPopupOpen(true);
                                }}
                                onDisabledClick={() => {
                                    setValidityCheck(true);
                                }}
                                bgColor="green"
                                text={'Принять'}
                                isDisabled={nextButtonDisabled()}
                            />
                        </>
                    )}
                </NavigationButtonsArea>
            </BottomNavigationPanel>
            <TextFieldPopup
                title={'Перейти на главный экран?'}
                mainContent={'Ты потеряешь всю заполненную информацию и вернёшься на главный экран'}
                isOpened={exitPopupOpen}
                onClose={() => {
                    setExitPopupOpen(false);
                }}
                isBackgroundClose={true}
            >
                <NavigationButtonsArea gapType="small">
                    <Button
                        onClick={() => {
                            setExitPopupOpen(false);
                        }}
                        text={'Отмена'}
                        bgColor={'gray'}
                    />
                    <Button
                        onClick={() => {
                            dispatch(clearAllData());
                            navigate(WELCOME_PAGE_URL);
                        }}
                        text={'Перейти'}
                        bgColor={'red'}
                    />
                </NavigationButtonsArea>
            </TextFieldPopup>
            <TextFieldPopup
                title={'Заявка успешно создана'}
                mainContent={'В ближайшее время с тобой свяжется исполнитель'}
                isOpened={successPopupOpen}
                onClose={() => {
                    setSuccessPopupOpen(false);
                }}
            >
                <NavigationButtonsArea>
                    <Button
                        onClick={() => {
                            navigate(ORDER_LIST_URL);
                            dispatch(clearAllData());
                        }}
                        text={'В главное меню'}
                        bgColor={'green'}
                    />
                </NavigationButtonsArea>
            </TextFieldPopup>
            <ImagePopup
                isOpened={orderData.selectedImage.isSelectedNow}
                onClose={() => {
                    dispatch(setImageSelected(false));
                }}
                isBackgroundClose={true}
            >
                <FullSizeImage
                    src={orderData.selectedImage.src}
                    alt={'выделенная картинка'}
                    OnCloseAction={() => {
                        dispatch(setImageSelected(false));
                    }}
                />
            </ImagePopup>
        </div>
    );
};

type NavigationButtonsProps = {
    gapType?: 'small' | 'normal';
    children: React.ReactNode;
};

const NavigationButtonsArea = (props: NavigationButtonsProps) => {
    const buttonGapClass = props.gapType == 'small' ? 'navigation-buttons_small-gap' : '';
    return <div className={`navigation-buttons ${buttonGapClass}`}>{props.children}</div>;
};

type SwiperProps = {
    children: React.ReactNode[];
    currentStage: number;
    onNextSlideSwipe?: () => void;
    onPreviousSlideSwipe?: () => void;
    canSwipeToNext?: boolean;
    onCantSwipeToNext?: () => void;
};

const Swiper = (props: SwiperProps) => {
    const [sliderState, setSliderState] = useState(0);
    const slideTrackRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (slideTrackRef.current) {
            const size = slideTrackRef.current.offsetWidth;
            slideTrackRef.current.style.transform = `translateX(${-size * sliderState}px)`;
        }
    }, [sliderState]);

    useEffect(() => {
        setSliderState(props.currentStage);
    }, [props.currentStage]);

    useEffect(() => {
        const minDistanse = 100;
        let touchStartPos = 0;
        let touchEndPos = 0;
        const onTouchStopHandler = (event: TouchEvent) => {
            touchEndPos = event.changedTouches[0].clientX;
            if (touchEndPos - touchStartPos > minDistanse) {
                if (sliderState > 0) {
                    setSliderState(sliderState - 1);
                    if (props.onPreviousSlideSwipe) props.onPreviousSlideSwipe();
                }
            } else if (touchStartPos - touchEndPos > minDistanse) {
                if (props.canSwipeToNext === undefined || props.canSwipeToNext) {
                    if (sliderState + 1 < props.children.length) {
                        setSliderState(sliderState + 1);
                        if (props.onNextSlideSwipe) props.onNextSlideSwipe();
                    }
                } else if (props.canSwipeToNext === false && props.onCantSwipeToNext) {
                    props.onCantSwipeToNext();
                }
            }
            slideTrackRef.current?.removeEventListener('touchend', onTouchStopHandler);
        };

        const onTouchStartHandler = (event: TouchEvent) => {
            touchStartPos = event.changedTouches[0].clientX;
            slideTrackRef.current?.addEventListener('touchend', onTouchStopHandler);
        };

        if (slideTrackRef.current) slideTrackRef.current.addEventListener('touchstart', onTouchStartHandler);
        return () => {
            slideTrackRef.current?.removeEventListener('touchend', onTouchStopHandler);
            slideTrackRef.current?.removeEventListener('touchstart', onTouchStartHandler);
        };
    }, [props.canSwipeToNext, sliderState]);
    return (
        <div ref={slideTrackRef} className={'page-main-area__slide-track'}>
            {props.children.map((elem, i) => (
                <div className="page-main-area__stage-wrappper" key={i}>
                    {elem}
                </div>
            ))}
        </div>
    );
};

type PageMainAreaProps = {
    header: string;
    children: React.ReactNode;
    onAvatarClick?: () => void;
};

export const PageMainAreaWrapper = (props: PageMainAreaProps) => {
    return (
        <div className={'page-main-area'}>
            <div className={'page-main-area__top-panel-wrapper'}>
                <div className={'page-main-area__top-panel-area'}>
                    <TopPanel>
                        <div
                            onClick={() => {
                                if (props.onAvatarClick) props.onAvatarClick();
                            }}
                            className={'small-logo-wrapper'}
                        >
                            <img src={logo} alt="лого" />
                        </div>
                        <Avatar />
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

const NEW_ORDER_URL = 'http://217.114.14.144:80/api/v1/task';
// const NEW_ORDER_URL = '';
type OrderData = {
    tg_chat_id: number;
    client_username: string;
    images: string[];
    title: string;
    description: string;
    address: string;
    execution_date: string;
    execution_times: TimeDurations[];
};

const toOrderData = (
    tg_chat_id: number,
    client_username: string,
    images: string[],
    title: string,
    description: string,
    address: string,
    execution_date: string,
    execution_times: TimeDurations[],
): OrderData => {
    const imagesWithoutB64: string[] = [];
    images.forEach(elem => {
        imagesWithoutB64.push(elem.split(',')[1]);
    });
    return {
        tg_chat_id: tg_chat_id,
        client_username: '@' + client_username,
        images: imagesWithoutB64,
        title: title,
        description: description,
        address: address,
        execution_date: execution_date,
        execution_times: execution_times,
    };
};

const fetchNewOrder = async (data: OrderData) => {
    try {
        console.log(data);
        const response = await fetch(NEW_ORDER_URL, {
            method: 'post',
            body: JSON.stringify(data),
        });
        if (response.status != 201) {
            throw new Error(`HTTP error while sendind order data! Status: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
