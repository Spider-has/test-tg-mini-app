import Calendar from 'color-calendar';
import { useCallback, useEffect, useMemo } from 'react';
import { OptionProps, OptionsList } from '../../components/inputs/Inputs';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { setOrderDate, setOrderExecTimes } from '../../store/orderSlice/order';

const dayTimeOptions = [
    { text: '8:00 - 10:00' },
    { text: '10:00 - 12:00' },
    { text: '12:00 - 14:00' },
    { text: '14:00 - 16:00' },
    { text: '16:00 - 18:00' },
    { text: '20:00 - 22:00' },
];

const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: '2-digit',
};

export const DateSelection = () => {
    const orderDate = useAppSelector(state => state.order.executionDate);
    const orderIntevals = useAppSelector(state => state.order.executionTimes);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const calendar = new Calendar({
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
            dateChanged: (currentDate: unknown) => {
                const newDate = currentDate as Date;
                dispatch(setOrderDate(newDate));
            },
        });
        calendar.setDate(orderDate);
    }, []);

    return (
        <div className={'date-select'}>
            <div className={'date-select__calendar-area'}>
                <span>Выбери желательную дату выполнения задачи</span>
                <div className={'date-select__calendar-wrapper'}>
                    <div id="color-calendar"></div>
                </div>
            </div>
            <SelectTimeIntervals
                intervals={orderIntevals}
                setTimeIntervals={(times: string[]) => {
                    dispatch(setOrderExecTimes(times));
                }}
                subtitle={`Выбери желательное время выполнения задачи на ${orderDate.toLocaleDateString(
                    'ru',
                    options,
                )}`}
            />
        </div>
    );
};

type TimeIntervalsSelectionProps = {
    intervals: string[];
    setTimeIntervals: (intervals: string[]) => void;
    subtitle: string;
};

export const SelectTimeIntervals = (props: TimeIntervalsSelectionProps) => {
    const onCheckBoxHandler = useCallback(
        (inpRef: React.RefObject<HTMLInputElement>, inpText: string) => {
            const copyIntervals = [...props.intervals];
            if (inpRef.current) {
                if (inpRef.current.checked) {
                    if (!copyIntervals.includes(inpText)) {
                        copyIntervals.push(inpText);
                    }
                } else {
                    if (copyIntervals.includes(inpText)) {
                        copyIntervals.splice(copyIntervals.indexOf(inpText), 1);
                    }
                }
            }
            props.setTimeIntervals(copyIntervals);
        },
        [props.intervals],
    );
    const optionList: OptionProps[] = useMemo(() => {
        return dayTimeOptions.map(elem => {
            let selected = false;
            if (props.intervals.includes(elem.text)) selected = true;
            return { text: elem.text, isSelected: selected };
        });
    }, [props.intervals]);
    return (
        <div className={'time-selection-area'}>
            <span>{props.subtitle}</span>
            <OptionsList options={optionList} onCheckboxClick={onCheckBoxHandler} />
        </div>
    );
};
