// 답변을 생성하고 수정하는 input 컴포넌트
import styled from 'styled-components';
import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { createAnswer, editAnswer } from 'api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;
const StyledTextArea = styled.textarea`
  width: 100%;
  height: 186px;
  background-color: var(--gray20);
  border: none;
  border-radius: 8px;
  resize: none;
  padding: 16px;

  &::-webkit-scrollbar {
    display: none;
  }

  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const AnswerInputForm = ({
  placeholder,
  children,
  questionId,
  originalAnswer = '',
  buttonText,
  type,
  answerId,
  onEditCancel,
}) => {
  // children prop이 전달되면 답변 수정상황으로 판단하여, children을 초기상태로 사용
  // 그렇지 않다면 답변 생성상황으로 판단하여, 빈 문자열을 초기 상태로 사용
  const [answer, setAnswer] = useState(children || '');

  // children prop이 변경될 때마다 answer 상태를 업데이트(답변 수정 시 초기 값이 원본 답변으로 설정되도록 함)
  useEffect(() => {
    setAnswer(children || '');
  }, [children]);

  const handleChange = e => {
    setAnswer(e.target.value);
  };

  const handleCreateAnswer = () => {
    createAnswer(questionId, answer).then(() => window.location.reload());
  };

  const handleEditAnswer = () => {
    editAnswer(answerId, answer).then(() => window.location.reload());
  };

  // 원본 답변과 현재 답변이 동일한지 여부를 체크
  const isAnswerUnchanged = originalAnswer.trim() === answer.trim();

  return (
    <Container>
      <StyledTextArea
        placeholder={placeholder}
        value={answer}
        onChange={handleChange}
      >
        {children}
      </StyledTextArea>
      {/*답변을 생성하는 input인 경우 '답변 완료' 버튼 하나, 답변을 수정하는 input인 경우 '수정완료' '수정취소' 두개의 버튼이 나타납니다.*/}
      {/*답변을 생성하는 input인 경우 handleCreateAnswer, 답변을 수정하는 input인 경우 handleEditAnswer 함수를 실행합니다.*/}
      <ButtonContainer>
        <Button
          // 답변이 비어있거나 변경되지 않았을 때 '수정 완료'버튼 비활성화
          inactive={answer.trim() === '' || isAnswerUnchanged}
          onClick={
            type === 'create answer' ? handleCreateAnswer : handleEditAnswer
          }
        >
          {buttonText}
        </Button>
        {type === 'edit answer' && (
          <Button onClick={onEditCancel}>수정 취소</Button>
        )}
      </ButtonContainer>
    </Container>
  );
};

export default AnswerInputForm;
