import { Link } from 'react-router-dom';
import './Button.scss';

type ButtonProps = {
    onClick: () => void;
    text: string;
    borderRound: 'small' | 'normal';
    textSize: 'small' | 'normal';
};

type LinkedButtonProps = {
    text: string;
    linkTo: string;
};

export const Button = (props: ButtonProps): JSX.Element => {
    const borderRadClass = props.borderRound == 'small' ? 'button_small-rounded' : '';
    const textSizeClass = props.borderRound == 'small' ? 'button_small-text' : '';
    return (
        <button className={`button ${borderRadClass} ${textSizeClass}`} onClick={props.onClick}>
            {props.text}
        </button>
    );
};

export const LinkedButton = (props: LinkedButtonProps): JSX.Element => {
    return (
        <Link to={props.linkTo}>
            <div className="button">{props.text}</div>
        </Link>
    );
};
