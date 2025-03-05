import { LinkedButton } from '../../components/button/Button';
import './RequestsList.scss';

export const RequestsList = () => {
    return (
        <div className={'requests-list'}>
            <div className={'requests-list__logo-area'}>
                <div className={'requests-list__logo'}>{/* <img src="" alt="лого" /> */}</div>
                <div className={'requests-list__text-area'}>
                    <span>AppyHappy — твой надежный помощник для заказа различных услуг.</span>
                    <span>
                        Просто опиши свою задачу, выбери удобные дату, время и место, а я найду для тебя
                        подходящего исполнителя и свяжу вас.
                    </span>
                </div>
            </div>
            <div className={'requests-list__button-area'}>
                <div>
                    <LinkedButton text={'Добавить заявку'} linkTo={'/requestCreation'} />
                </div>
            </div>
        </div>
    );
};
