import { Button } from '../../components/button/Button';
import { AddImageIcon } from '../../static/icons/icons';
import './RequestCreation.scss';
import { OptionsList, OptionsProps, TextAreaInput, TextInput } from '../../components/inputs/Inputs';
import { useEffect, useState } from 'react';
import Calendar from 'color-calendar';
import 'color-calendar/dist/css/theme-glass.css';
import { useNavigate } from 'react-router-dom';

const TaskDescription = () => {
    return (
        <>
            <div className={'request-creation__task-image-area'}>
                <span>Добавь 1-3 фотографии своей задачи</span>
                <div className={'request-creation__add-image-icon-area'}>
                    <AddImageIcon />
                </div>
            </div>
            <div className={'request-creation__task-header-area'}>
                <span>Опиши суть задачи несколькими словами</span>
                <TextInput maxLength={40} placeholder={'Заголовок задачи'} />
            </div>
            <div className={'request-creation__task-description-area'}>
                <span>Опиши свою задачу подробнее</span>
                <TextAreaInput placeholder="Подробное описание задачи" />
            </div>
        </>
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
            fontFamilyHeader: "'Raleway', sans-serif",
            fontFamilyBody: "'Raleway', sans-serif",
            fontFamilyWeekdays: "'Raleway', sans-serif",
            monthDisplayType: 'long',
            primaryColor: '#222222',
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
        <div className={'request-creation__date-select-area'}>
            <div className={'request-creation__calendar-area'}>
                <span>Выбери желательную дату выполнения задачи</span>
                <div className={'request-creation__calendar-wrapper'}>
                    <div id="color-calendar"></div>
                </div>
            </div>
            <div className={'request-creation__time-select-area'}>
                <span>Выбери желательное время выполнения задачи</span>
                <OptionsList {...dayTimeOptionsList} />
            </div>
        </div>
    );
};

const PlaceSelection = () => {
    return (
        <div className={'request-creation__place-select-area'}>
            <div className={'request-creation__place-select-subltitle'}>
                <span>Выбери место, где нужно выполнить твою задачу</span>
            </div>
            <div className={'request-creation__place-select-buttons'}>
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
            </div>
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
                <div className={'request-creation__title'}>
                    <h1>Создание заявки от 13 февраля</h1>
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
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
