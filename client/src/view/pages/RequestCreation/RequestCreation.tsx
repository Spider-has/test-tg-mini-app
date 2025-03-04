import { Link } from 'react-router-dom';
import { Button } from '../../components/button/Button';
import { AddImage } from '../../static/icons/icons';
import './RequestCreation.scss';

export const RequestCreation = () => {
    return (
        <div className={'request-creation'}>
            <div className={'request-creation__input-area'}>
                <div className={'request-creation__title'}>
                    <h1>Создание заявки от 13 февраля</h1>
                </div>
                <div className={'request-creation__task-image-area'}>
                    <span>Добавь 1-3 фотографии своей задачи</span>
                    <div className={'request-creation__add-image-icon-area'}>
                        <AddImage />
                    </div>
                </div>
                <div className={'request-creation__task-header-area'}>
                    <span>Опиши суть задачи несколькими словами</span>
                    <input className={'input'} type="text" maxLength={40} placeholder="Заголовок задачи" />
                </div>
                <div className={'request-creation__task-description-area'}>
                    <span>Опиши свою задачу подробнее</span>
                    <textarea
                        className={'input input_multi-line'}
                        placeholder="Подробное описание задачи"
                    ></textarea>
                </div>
            </div>
            <div className={'request-creation__pages-navigation-area'}>
                <div>
                    <Link to={'/start'}>
                        <Button onClick={() => 0} text={'Назад'} />
                    </Link>
                </div>
                <div>
                    <Button onClick={() => 0} text={'Далее'} />
                </div>
            </div>
        </div>
    );
};
