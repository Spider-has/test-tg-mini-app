import { LinkedButton } from '../../components/button/Button';
import './RequestsList.scss';
import logo from '../../static/images/logo.png';
import { TopPanel } from '../requestCreation/RequestCreation';
import { ChangeThemeIcon } from '../../static/icons/icons';
import { Avatar } from '../../components/avatar/Avatar';

export const RequestsList = () => {
    return (
        <div className={'requests-list'}>
            <div className="requests-list__main-area-container">
                <div className={'requests-list__main-area'}>
                    <TopPanel>
                        <ChangeThemeIcon />
                        <Avatar link="" path="" altText="" />
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
                    <LinkedButton bgColor="yellow" text={'Заказать услугу'} linkTo={'/requestCreation'} />
                </div>
            </div>
        </div>
    );
};
