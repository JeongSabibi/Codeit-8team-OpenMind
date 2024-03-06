// 미답변/답변완료 뱃지, 질문&답변 본문, 좋아요&싫어요 버튼 전체를 감싸는 컴포넌트
import styled from 'styled-components';
import AnswerBadge from './AnswerBadge';
import Reactions from './Reactions';
import QnAItem from './QnAItem';
import Kebab from 'components/post/Kebab';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  createAnswer,
  deleteAnswer,
  deleteQuestion,
  editAnswer,
} from '../../api';

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 32px;

  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 4px 4px 0 #8c8c8c40;
`;

const HeadContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PostItem = ({ qnaData }) => {
  // 현재 내가 있는 페이지가 답변하기(/answer)페이지인지 구별합니다.
  const { pathname } = useLocation();
  const paths = pathname.split('/');
  const isAnswerPage = paths[paths.length - 1] === 'answer';

  // 수정 모드를 정하는 상태입니다.
  const [isEdit, setIsEdit] = useState(false);

  const handleDeleteQuestion = () => {
    deleteQuestion(qnaData.id).then(() => window.location.reload());
  };

  const handleDeleteAnswer = () => {
    if (!qnaData.answer) alert('삭제할 답변이 없어요.😭');
    else deleteAnswer(qnaData.answer.id).then(() => window.location.reload());
  };

  const handleRejectAnswer = () => {
    // 기존에 답변이 존재하지 않는 경우에는 '답변 거절' 이라는 본문을 넣은 새로운 답변을 생성하며,
    if (!qnaData.answer) {
      createAnswer(qnaData.id, '답변 거절', true).then(() =>
        window.location.reload(),
      );
    }
    // 기존에 답변이 존재하는 경우에는 기존 답변의 내용을 담아 isRejected 상태만 수정하여 서버에 보냅니다.
    else {
      editAnswer(qnaData.answer.id, qnaData.answer.content, true).then(() =>
        window.location.reload(),
      );
    }
  };

  if (!qnaData) return <></>;

  return (
    <PostContainer>
      <HeadContainer>
        <AnswerBadge isAnswered={qnaData.answer} />
        {/*케밥은 답변하기 페이지에서만 나타납니다.*/}
        {isAnswerPage && (
          <Kebab
            onEditClick={() => {
              if (!qnaData.answer) alert('수정할 답변이 없어요.😭');
              else setIsEdit(true);
            }}
            onDeleteQuestionClick={handleDeleteQuestion}
            onDeleteAnswerClick={handleDeleteAnswer}
            onRejectClick={handleRejectAnswer}
          />
        )}
      </HeadContainer>
      <div>
        {qnaData && (
          <QnAItem
            qnaData={qnaData}
            isAnswerPage={isAnswerPage}
            isEdit={isEdit}
            onEditCancel={() => setIsEdit(false)}
          />
        )}
      </div>
      <Reactions qnaData={qnaData} />
    </PostContainer>
  );
};

export default PostItem;
