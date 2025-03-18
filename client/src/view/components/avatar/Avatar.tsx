import { useAppSelector } from '../../hooks/hooks';
import './Avatar.scss';

type AvatarProps = {
    path: string;
    altText: string;
    link: string;
};

export const Avatar = () => {
    const avatar = useAppSelector(state => state.user.avatarUrl);
    return (
        <div className={'avatar'}>
            <img src={avatar} alt={'Ваш аватар'} />
        </div>
    );
};
