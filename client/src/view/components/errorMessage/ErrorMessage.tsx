import { useEffect, useRef } from 'react';
import { ErrorIcon } from '../../static/icons/icons';
import './ErrorMessage.scss';

type ErrorMessageProps = {
    text: string;
    shown: boolean;
};

export const ErrorMessage = (props: ErrorMessageProps) => {
    const messageRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (messageRef.current && props.shown) {
            messageRef.current.classList.add('error-message_show');
        } else if (!props.shown && messageRef.current) {
            messageRef.current.classList.remove('error-message_show');
        }
    }, [props.shown]);
    return (
        <div ref={messageRef} className={'error-message'}>
            <ErrorIcon />
            <span>{props.text}</span>
        </div>
    );
};
