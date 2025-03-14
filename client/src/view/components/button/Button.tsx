import { Link } from 'react-router-dom';
import './Button.scss';

type ButtonProps = {
    onClick: () => void;
    text: string;
    borderRound?: 'small' | 'normal';
    textSize?: 'small' | 'normal';
    bgColor: 'yellow' | 'green' | 'red' | 'gray';
    isDisabled?: boolean;
};

type LinkedButtonProps = {
    text: string;
    linkTo: string;
    bgColor: 'yellow' | 'green' | 'red' | 'gray';
};

export const Button = (props: ButtonProps): JSX.Element => {
    const borderRadClass = props.borderRound == 'small' ? 'button_small-rounded' : '';
    const textSizeClass = props.borderRound == 'small' ? 'button_small-text' : '';
    const buttonBackColor = `button_${props.bgColor}`;
    const disabledClass = props.isDisabled ? 'button_disabled' : '';
    return (
        <button
            className={`button ${borderRadClass} ${textSizeClass} ${buttonBackColor} ${disabledClass}`}
            onClick={props.onClick}
            disabled={props.isDisabled}
        >
            {props.text}
        </button>
    );
};

export const LinkedButton = (props: LinkedButtonProps): JSX.Element => {
    const buttonBackColor = `button_${props.bgColor}`;
    return (
        <Link className={`button button_linked  button_big-padding ${buttonBackColor}`} to={props.linkTo}>
            {props.text}
        </Link>
    );
};
