'use client';

import Result from '@/components/Result';
import SpeakingAssessment from '@/components/SpeakingAssessment';
import WritingAssessment from '@/components/WritingAssessment';
import { useSearchParams } from 'next/navigation';

const ResultPage = () => {
  const searchParams = useSearchParams();
  return (
    <>
      {searchParams.get('writing') ? (
        <WritingAssessment
          testId={searchParams.get('testId') ?? ''}
          testSubmissionId={searchParams.get('testSubmissionId') ?? ''}
          part={searchParams.get('part') ?? ''}
        />
      ) : searchParams.get('speaking') ? (
        <SpeakingAssessment
          testId={searchParams.get('testId') ?? ''}
          testSubmissionId={searchParams.get('testSubmissionId') ?? ''}
          part={searchParams.get('part') ?? ''}
        />
      ) : (
        <Result
          testId={searchParams.get('testId') ?? ''}
          testSubmissionId={searchParams.get('testSubmissionId') ?? ''}
          part={searchParams.get('part') ?? ''}
        />
      )}
    </>
  );
};

export default ResultPage;
