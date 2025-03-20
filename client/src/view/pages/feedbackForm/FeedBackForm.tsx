import { useCallback, useState } from 'react';
import { Button } from '../../components/button/Button';
import { RadioInputList, RadioOption, TextAreaInput } from '../../components/inputs/Inputs';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { OptionsList, setComment, setImportantOption } from '../../store/feedbackSlice/feedback';
import { BottomNavigationPanel, PageMainAreaWrapper } from '../orderCreation/OrderCreation';
import './FeedBackForm.scss';
import { ErrorMessage } from '../../components/errorMessage/ErrorMessage';
import { useNavigate } from 'react-router-dom';
import { ORDER_LIST_URL } from '../../../App';

const options: RadioOption[] = [
    { text: OptionsList.TIME },
    { text: OptionsList.MONEY },
    { text: OptionsList.SPECIALIST_CONFIDENCE },
];

export const FeedBackForm = () => {
    const formData = useAppSelector(state => state.feedback);
    const dispatch = useAppDispatch();
    const onSelectedChange = useCallback((i: number) => {
        dispatch(setImportantOption(options[i].text));
    }, []);
    const [checkValidy, setCheckValidity] = useState(false);
    const navigate = useNavigate();
    return (
        <div className={'feedback-form'}>
            <PageMainAreaWrapper header={'Обратная связь'}>
                <div className="feedback-form__inputs-area">
                    <div className="feedback-form__single-input-area">
                        <span>Что для тебя было самым важным?</span>
                        <div className="feedback-form__radio-options">
                            <RadioInputList
                                isValid={!(checkValidy && formData.importantOption == '')}
                                onSelectedChange={onSelectedChange}
                                Options={options}
                            />
                        </div>
                    </div>
                    <div className="feedback-form__single-input-area">
                        <span>Примечание</span>
                        <TextAreaInput
                            placeholder={'Поделись своими идеями, как мы можем сделать сервис лучше'}
                            value={formData.comment}
                            onInputHandler={(value: string) => {
                                dispatch(setComment(value));
                            }}
                        />
                    </div>
                    <div>
                        <ErrorMessage
                            text={'Должен быть выбран вариант ответа'}
                            shown={checkValidy && formData.importantOption == ''}
                        />
                    </div>
                </div>
            </PageMainAreaWrapper>
            <BottomNavigationPanel>
                <div>
                    <Button
                        onClick={() => {
                            fetchFeedBackData(
                                toFethFeedbackData(
                                    formData.orderId,
                                    formData.importantOption,
                                    formData.comment,
                                ),
                            ).then(res => {
                                if (res?.status === 200) {
                                    navigate(ORDER_LIST_URL);
                                }
                            });
                        }}
                        onDisabledClick={() => {
                            setCheckValidity(true);
                        }}
                        text={'Отправить'}
                        bgColor={'green'}
                        paddingType={'big'}
                        isDisabled={formData.importantOption == ''}
                    />
                </div>
            </BottomNavigationPanel>
        </div>
    );
};

type FetchFeedback = {
    order_id: number;
    most_important: string;
    comment: string;
};

const feedbackUrl = 'http://localhost:80/api/v1/poll';

const toFethFeedbackData = (orderId: number, importantOpt: string, comment: string): FetchFeedback => {
    return {
        order_id: orderId,
        most_important: importantOpt,
        comment: comment,
    };
};

const fetchFeedBackData = async (data: FetchFeedback) => {
    try {
        const response = await fetch(feedbackUrl, {
            method: 'post',
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`error fetching data: ${response.status}`);
        return response;
    } catch (err) {
        console.error(err);
    }
};
