'use client';
import SkillHeader from '@/components/SkillHeader';
import { Spin, Button, notification, Empty, Input } from 'antd';
import styles from '@/styles/pages/TestLanding.module.scss';
import { User } from 'firebase/auth';
import { auth } from '@/lib';
import useSWR from 'swr';
import { useEffect, useState, useRef } from 'react';
import TextCard from '@/components/TextCard';
import TestDetails from '@/components/TestDetails';
import PartSelector from '@/components/PartSelector';
import Comment from '@/components/Comment';
import { SendOutlined } from '@ant-design/icons';
interface test_answer {
  test_id: string;
  parts: {
    _id: string;
    question_groups: {
      _id: string;
      questions: {
        _id: string;
        answer_result: {
          user_answer: string | string[];
        };
      }[];
    }[];
  }[];
}
interface FetchArgs {
  url: string;
  user: User | null;
}

const fetcher = async ({ url, user }: FetchArgs) => {
  const token = await user?.getIdToken();
  console.log(token);
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  if (response.status === 'error') {
    throw new Error(response.error.message);
  }

  return response.data;
};

const { TextArea } = Input;

export default function TestLanding({ params }: { params: { id: string } }) {
  const [totalPage, setTotalPage] = useState(1);
  const [totalComments, setComments] = useState([] as any[]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = auth.currentUser;
  const {
    data: test,
    error,
    isLoading,
  } = useSWR({ url: `/api/tests/${params.id}`, user }, fetcher);
  const {
    data: comments,
    error: errorComment,
    isLoading: isLoadingComment,
  } = useSWR(
    { url: `/api/comment/${params.id}?page=${totalPage}`, user },
    fetcher
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  useEffect(() => {
    if (error) {
      notificationApi.error({
        message: 'Error',
        description: error?.message,
      });
    }
  }, [error, notificationApi]);
  const handleLoad = () => {
    setTotalPage((prev) => prev + 1);
  };
  // TODO: use react inf scroll
  // useEffect(() => {
  //     const scrollElement = scrollRef.current;
  //     if (scrollElement) {
  //         scrollElement.addEventListener('scroll', () => {
  //             if (scrollElement.scrollHeight - scrollElement.scrollTop <= scrollElement.clientHeight) {
  //                 if (totalPage >= (comments.pagination.total_count / 20)) {
  //                     return;
  //                 }
  //                 handleLoad();
  //             }
  //         });
  //     }
  //     return () => {
  //         scrollElement?.removeEventListener('scroll', () => { });
  //     }
  // });
  useEffect(() => {
    if (comments) {
      setComments((prev) => {
        const tempSet = new Set([...prev, ...comments.test_comments]);
        return Array.from(tempSet);
      });
    }
  }, [comments]);
  if (isLoading) {
    return <Spin size="large" />;
  }
  const commentSection = totalComments.map((comment) => (
    <Comment
      key={comment._id}
      id={comment._id}
      userName={'lorem Ipsum'}
      userPhotoURL={
        'https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY'
      }
      createdDate={comment.created_at}
      content={comment.comment}
    />
  ));
  commentSection.push(
    <Comment
      key={'acssasdsad'}
      id={'as'}
      userName={'lorem Ipsum'}
      userPhotoURL="https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY"
      createdDate={'1-1-1970'}
      content={
        'lmaasd ksadj alksdj lkasjd lsaj dlksajd lkasjd alksjd oiasj daslid jlsak dhsalkd jalsdj alksdjo lmaasd ksadj alksdj lkasjd lsaj dlksajd lkasjd alksjd oiasj daslid jlsak dhsalkd jalsdj alksdjo lmaasd ksadj alksdj lkasjd lsaj dlksajd lkasjd alksjd oiasj daslid jlsak dhsalkd jalsdj alksdjo lmaasd ksadj alksdj lkasjd lsaj dlksajd lkasjd alksjd oiasj daslid jlsak dhsalkd jalsdj alksdjo lmaasd ksadj alksdj lkasjd lsaj dlksajd lkasjd alksjd oiasj daslid jlsak dhsalkd jalsdj alksdjolmaasd ksadj alksdj lkasjd lsaj dlksajd lkasjd alksjd oiasj daslid jlsak dhsalkd jalsdj alksdjolmaasd ksadj alksdj lkasjd lsaj dlksajd lkasjd alksjd oiasj daslid jlsak dhsalkd jalsdj alksdjolmaasd ksadj alksdj lkasjd lsaj dlksajd lkasjd alksjd oiasj daslid jlsak dhsalkd jalsdj alksdjo'
      }
    />
  );
  commentSection.push(
    <Comment
      key={'acssasdsad'}
      id={'as'}
      userName={'lorem Ipsum'}
      userPhotoURL="https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY"
      createdDate={'1-1-1970'}
      content={
        'lmaasd ksadj alksdj lkasjd lsaj dlksajd lkasjd alksjd oiasj daslid jlsak dhsalkd jalsdj alksdjo lmaasd ksadj alksdj lkasjd lsaj dlksajd lkasjd alksjd oiasj daslid jlsak dhsalkd jalsdj alksdjo lmaasd ksadj alksdj lkasjd lsaj dlksajd lkasjd alksjd oiasj daslid jlsak'
      }
    />
  );
  const parts =
    test?.parts.map((part: { part_duration: number }, index: number) => {
      return { index: index + 1, time: part.part_duration };
    }) || [];
  return (
    <div className={styles.pageWrapper}>
      {contextHolder}
      <SkillHeader title={test.test_name} />
      <TextCard
        width={'90%'}
        height={'auto'}
      >
        <TestDetails
          user_name={test?.user?.display_name || 'lorem ipsum'}
          rating={test?.review.star || 3.2}
          rating_count={test?.review.count || 13}
          update_date={test.updated_at || '2024-04-23T06:57:19.523Z'}
          submission_count={test.submission_count || 100}
        />
        <PartSelector
          parts={parts}
          testId={params.id}
        />
        <div
          className={styles.commentWrapper}
          ref={scrollRef}
        >
          {isLoadingComment && <Spin size="large" />}
          {!isLoadingComment && commentSection.length === 0 ? <Empty /> : null}
          {!isLoadingComment && commentSection.length > 0
            ? commentSection
            : null}
        </div>
        <div className={styles.commentInputWrapper}>
          <div className={styles.commentInput}>
            <img
              src={
                'https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY'
              }
              className={styles.avatar}
              alt="avatar"
            />
            <div className={styles.inputAndSendBtn}>
              <TextArea
                placeholder="Viết comment"
                className={styles.inputComment}
                autoSize
              />
              <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                size="large"
              />
            </div>
          </div>
        </div>
      </TextCard>
    </div>
  );
}