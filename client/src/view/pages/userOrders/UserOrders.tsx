import { useEffect } from 'react';
import { LinkedButton } from '../../components/button/Button';
import { CalendarIcon } from '../../static/icons/icons';
import { BottomNavigationPanel, PageMainAreaWrapper } from '../orderCreation/OrderCreation';
import './UserOrders.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchOrders } from '../../store/orderListSlice/orderList';
import { AppDispatch } from '../../store/store';

export enum OrderState {
    IN_SEARCH,
    AT_WORK,
    COMPLETED,
}

type OrderProps = {
    header: string;
    date: Date;
    state: OrderState;
};

const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
};

const Order = (props: OrderProps) => {
    return (
        <div className={'order-short-info'}>
            <h2 className={'order-short-info__title'}>{props.header}</h2>
            <div className={'order-short-info__date'}>
                <div>
                    <CalendarIcon />
                </div>
                {props.date.toLocaleDateString('ru', options)}
            </div>
            <ProcessBar state={props.state} />
        </div>
    );
};

type ProcessBarProps = {
    state: OrderState;
};

const ProcessBar = (props: ProcessBarProps) => {
    let colorModification = '';
    let text = '';
    switch (props.state) {
        case OrderState.IN_SEARCH:
            colorModification = 'in-search';
            text = 'Поиск исполнителя';
            break;
        case OrderState.AT_WORK:
            colorModification = 'at-work';
            text = 'В работе';
            break;
        case OrderState.COMPLETED:
            colorModification = 'completed';
            text = 'Выполнен';
            break;
    }
    return (
        <div className={`order-state-bar order-state-bar_${colorModification}`}>
            <div></div>
            <span>{text}</span>
        </div>
    );
};

type UserOrderListProps = {
    orders: OrderProps[];
};

const UserOrdersList = (props: UserOrderListProps) => {
    const orders = props.orders.map((elem, i) => <Order key={i} {...elem} />);
    return <div className={'user-orders-list'}>{orders}</div>;
};

const defaultOrderList: UserOrderListProps = {
    orders: [
        {
            header: 'Заголовок задачи',
            date: new Date(),
            state: OrderState.IN_SEARCH,
        },
        {
            header: 'Заголовок задачи',
            date: new Date('2025-02-14'),
            state: OrderState.AT_WORK,
        },
        {
            header: 'Заголовок задачи',
            date: new Date('2025-02-9'),
            state: OrderState.COMPLETED,
        },
        {
            header: 'Заголовок задачи',
            date: new Date('2025-02-2'),
            state: OrderState.IN_SEARCH,
        },
        {
            header: 'Заголовок задачи',
            date: new Date('2025-02-2'),
            state: OrderState.IN_SEARCH,
        },
    ],
};

export const UserOrders = () => {
    // const dispatch = useAppDispatch();
    // const userId = useAppSelector(state => state.user.chatId);
    // const OrdersList = useAppSelector(state => state.ordersList);
    // useEffect(() => {
    //     // dispatch(fetchOrders(userId));
    //     fetch('http://217.114.14.144:80/api/v1/task/1?page=1&limit=10', {
    //         method: 'get',
    //         mode: 'no-cors',
    //     })
    //         .then(res => res.json())
    //         .then(res => console.log(res))
    //         .catch(err => {
    //             console.log(err);
    //         });
    // }, []);
    // console.log(OrdersList);
    return (
        <div className="user-orders-page">
            <PageMainAreaWrapper header={'Мои заказы'}>
                <UserOrdersList {...defaultOrderList} />
            </PageMainAreaWrapper>
            <BottomNavigationPanel>
                <div>
                    <LinkedButton bgColor="yellow" text={'Заказать услугу'} linkTo={'/orderCreation'} />
                </div>
            </BottomNavigationPanel>
        </div>
    );
};
