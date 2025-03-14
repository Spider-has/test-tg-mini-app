import { memo } from 'react';
import { CloseIcon } from '../../static/icons/icons';

type UploadedImageProps = {
    src: string;
    alt: string;
    type: 'big' | 'small';
    index: number;
    OnCloseAction: (imageI: number) => void;
};

export const UploadedImage = memo(function UploadedImage(props: UploadedImageProps) {
    const containerSizeType =
        props.type === 'big' ? 'request-task__big-image-wrapper' : 'request-task__small-image-wrapper';
    const imageSizeType = props.type === 'big' ? 'task-image_big' : 'task-image_small';
    return (
        <div className={containerSizeType}>
            <div className={`task-image ${imageSizeType}`}>
                <img src={props.src} alt={props.alt} />
                <div
                    className={'task-image__close-icon'}
                    onClick={() => {
                        props.OnCloseAction(props.index);
                    }}
                >
                    <CloseIcon />
                </div>
            </div>
        </div>
    );
});
