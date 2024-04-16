'use client';

import styles from '@/styles/pages/writing/Writing.module.scss';
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [resultData, setResultData] = useState<
    Array<{ topic: string; content: string }>
  >([]);

  type ResultData =
    | {
        type: string;
        topic: string;
        assessment: {
          task_achievement: {
            band_score: number;
            examiner_feedback: string;
            band_descriptors: string;
          };
          coherence_and_cohesion: {
            band_score: number;
            examiner_feedback: string;
            band_descriptors: string;
          };
          lexical_resource: {
            band_score: number;
            examiner_feedback: string;
            band_descriptors: string;
          };
          grammatical_range_and_accuracy: {
            band_score: number;
            examiner_feedback: string;
            band_descriptors: string;
          };
          overall_presentation: {
            band_score: number;
            examiner_feedback: string;
            band_descriptors: string;
          };
          final_score: 6;
        };
      }
    | undefined;

  const [partOneResult, setPartOneResult] = useState<ResultData | undefined>(
    undefined
  );
  const [partTwoResult, setPartTwoResult] = useState<ResultData | undefined>(
    undefined
  );

  useEffect(() => {
    const storedResultData = localStorage.getItem('resultData');
    if (storedResultData) {
      setResultData(JSON.parse(storedResultData));
    }
  }, []);

  const callAssessAPI = async (topic: string, content: string) => {
    const response = await fetch('/api/ai/assess-writing/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'essay',
        topic: topic,
        content: content,
      }),
    });

    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const getResults = async () => {
      if (resultData[0]) {
        const result = await callAssessAPI(
          resultData[0].topic,
          resultData[0].content
        );
        setPartOneResult(result.data);
      }

      if (resultData.length > 1) {
        const result = await callAssessAPI(
          resultData[1].topic,
          resultData[1].content
        );
        setPartTwoResult(result.data);
      }
    };

    getResults();
  }, [resultData]);

  const results: (ResultData | undefined)[] = [partOneResult, partTwoResult];

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>Kết quả</h2>
        <div className={styles.mainContainer}>
          {results.map(
            (result, index) =>
              result && (
                <div
                  className={styles.resultContainer}
                  key={index}
                >
                  <h3 className={styles.resultTitle}>Task {index + 1}</h3>
                  <div className={styles.resultContent}>
                    <p>Đề bài: {result.topic}</p>
                    <p>Final Score: {result.assessment.final_score}</p>
                    {Object.entries(result.assessment).map(([key, value]) => {
                      if (key !== 'final_score' && typeof value === 'object') {
                        return (
                          <div key={key}>
                            <h4>{key}</h4>
                            <p>Band Score: {value.band_score}</p>
                            <p>Examiner Feedback: {value.examiner_feedback}</p>
                            <p>Band Descriptors: {value.band_descriptors}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
}
