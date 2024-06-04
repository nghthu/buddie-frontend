'use client';

import Result from '@/components/Result';
import { useSearchParams } from 'next/navigation';

const ResultPage = () => {
  const searchParams = useSearchParams();
  return (
    <>
      <Result
        testId={searchParams.get('testId') ?? ''}
        testSubmissionId={searchParams.get('testSubmissionId') ?? ''}
        part={searchParams.get('part') ?? ''}
      />
    </>
  );
};

export default ResultPage;
