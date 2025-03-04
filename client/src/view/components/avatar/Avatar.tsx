import './Avatar.scss';

type AvatarProps = {
    path: string;
    altText: string;
    link: string;
};

export const Avatar = (props: AvatarProps) => {
    return (
        <div className={'avatar'}>
            <img src={props.path} alt={props.altText} />
        </div>
    );
};
