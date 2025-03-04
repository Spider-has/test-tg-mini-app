import { Avatar } from '../../components/avatar/Avatar';
import { Button } from '../../components/button/Button';
import './RequestsList.scss';

export const RequestsList = () => {
    return (
        <div className={'requests-list'}>
            <div className={'requests-list__logo-area'}>
                <div className={'requests-list__avatar-area'}>
                    <Avatar path="" altText="Ваш аватар" link="" />
                </div>

                <div className={'requests-list__logo'}>
                    <img src="" alt="Наше лого" />
                </div>
            </div>
            <div className={'requests-list__button-area'}>
                <Button onClick={() => 0} text={'Добавить заявку'} />
            </div>
        </div>
    );
};
