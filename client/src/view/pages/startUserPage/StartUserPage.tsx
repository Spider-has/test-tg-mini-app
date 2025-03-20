import { LinkedButton } from '../../components/button/Button';
import './StartUserPage.scss';
import logo from '../../static/images/logo.png';
import { Avatar } from '../../components/avatar/Avatar';
import { TopPanel } from '../../components/topPanel/TopPanel';
import { useAppSelector } from '../../hooks/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ORDER_LIST_URL } from '../../../App';

export const StartUserPage = () => {
    const userOrdersData = useAppSelector(state => state.ordersList.orders);
    const navigate = useNavigate();
    useEffect(() => {
        if (userOrdersData.length > 0) navigate(ORDER_LIST_URL);
    }, [userOrdersData]);
    return (
        <div className={'requests-list'}>
            <div className="requests-list__main-area-container">
                <div className={'requests-list__main-area'}>
                    <TopPanel>
                        <Avatar />
                    </TopPanel>
                    <div className={'requests-list__main-content'}>
                        <div className={'requests-list__logo'}>
                            <img src={logo} alt="лого" />
                        </div>
                        <div className={'requests-list__text-area'}>
                            <div>
                                <span className={'requests-list__brand-name'}>AppyHappy </span>
                                <span>— твой надежный помощник в заказе услуг.</span>
                            </div>
                            <span>
                                Просто расскажи, что нужно сделать, укажи удобные дату, время и место — а я
                                найду для тебя проверенного исполнителя и организую ваше взаимодействие.
                                Просто, быстро и с заботой о твоем комфорте!
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'requests-list__button-area'}>
                <div>
                    <LinkedButton bgColor="yellow" text={'Заказать услугу'} linkTo={'/orderCreation'} />
                </div>
            </div>
        </div>
    );
};
