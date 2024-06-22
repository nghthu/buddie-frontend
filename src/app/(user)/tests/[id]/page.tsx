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
// interface test_answer {
//   test_id: string;
//   parts: {
//     _id: string;
//     question_groups: {
//       _id: string;
//       questions: {
//         _id: string;
//         answer_result: {
//           user_answer: string | string[];
//         };
//       }[];
//     }[];
//   }[];
// }
interface userComment {
  user_id: string;
  display_name: string;
  photo_url: string;
}
interface comment {
  _id: string;
  test_id: string;
  comment: string;
  created_at: string;
  user: userComment;
}
interface FetchArgs {
  url: string;
  user: User | null;
}

const fetcher = async ({ url, user }: FetchArgs) => {
  const token = await user?.getIdToken();
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
  // TODO: Implement infinite scroll and fetch more data and use setTotalPage
  const [isFetching, setIsFetching] = useState(false);
  const [totalPage] = useState(1);
  const [totalComments, setComments] = useState([] as comment[]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
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
    if (errorComment) {
      notificationApi.error({
        message: 'Error',
        description: errorComment?.message,
      });
    }
  }, [error, errorComment, notificationApi]);
  // const handleLoad = () => {
  //   setTotalPage((prev) => prev + 1);
  // };
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
        const tempSet = [...prev, ...comments.test_comments];
        const seen = new Set();
        const uniqueComments = tempSet.filter((comment) => {
          const isDuplicate = seen.has(comment._id);
          seen.add(comment._id);
          return !isDuplicate;
        });
        return Array.from(uniqueComments);
      });
    }
  }, [comments]);
  useEffect(() => {
    if (test && test.review) {
      setRating(test.review.star);
      setTotalRating(test.review.count);
    }
  }, [test]);
  if (isLoading) {
    return <Spin size="large" />;
  }

  const commentSection = totalComments.map((comment) => (
    <Comment
      key={comment._id}
      id={comment._id}
      userName={comment.user.display_name}
      userPhotoURL={comment.user.photo_url}
      createdDate={comment.created_at}
      content={comment.comment}
    />
  ));

  const parts =
    test?.parts.map((part: { part_duration: number }, index: number) => {
      return { index: index + 1, time: part.part_duration };
    }) || [];

  const handleSendComment = async () => {
    setIsFetching(true);
    const token = await user?.getIdToken();

    const response = await fetch(`/api/comment/${params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        test_id: params.id,
        comment: comment,
      }),
    });
    setComment('');
    const data = await response.json();
    if (data.status === 'error') {
      notificationApi.error({
        message: 'Error',
        description: data.error.message,
      });
    } else {
      setComments((prev) => {
        const tempSet = new Set([...prev, data.data]);
        return Array.from(tempSet);
      });
    }
    setIsFetching(false);
  };
  const handleRefresh = (rate: number) => {
    // const token = await user?.getIdToken();
    setRating((prev) => {
      const totalRate = totalRating;
      return (prev * totalRate + rate) / (totalRate + 1);
    });
    setTotalRating((prev) => prev + 1);
    // const newTest = await fetch(`/api/tests/${params.id}`, {
    //   headers: {
    //     authorization: `Bearer ${token}`,
    //   },
    // }).then((res) => res.json());
    // await mutate(`/api/tests/${params.id}`, newTest.data, true);
  };
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
          rating={rating || 0}
          rating_count={totalRating || 0}
          create_date={test.created_at || '2024-04-23T06:57:19.523Z'}
          submission_count={test.submission_count || 0}
          test_id={test._id}
          handleRefresh={handleRefresh}
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
              src={user?.photoURL ?? ''}
              className={styles.avatar}
              alt="Your avatar"
            />
            <div className={styles.inputAndSendBtn}>
              <TextArea
                placeholder="Viết comment"
                className={styles.inputComment}
                autoSize
                value={comment}
                onChange={(e) => {
                  setComment(e.currentTarget.value);
                }}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                size="large"
                onClick={handleSendComment}
                disabled={isFetching}
              />
            </div>
          </div>
        </div>
      </TextCard>
    </div>
  );
}
