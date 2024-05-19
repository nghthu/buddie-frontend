'use client';

import styles from '@/styles/components/SpeakingAssessment.module.scss';
import { Progress } from 'antd';
import type { ProgressProps } from 'antd';

const DUMMY_DATA = {
  transcription:
    "So my hometown are a tiny village in Malaysia in about forty kilometres away from any major city. Most people probably wouldn't be able to find them on maps.",
  overall: 6.5,
  fluency_coherence: 6,
  lexical_resource: 7,
  grammar: 7,
  pronunciation: 6,
  relevance: 100,
  sentences: [
    {
      sentence:
        'So my hometown are a tiny village in Malaysia in about forty kilometres away from any major city.',
      grammar: {
        corrected:
          'So my hometown is a tiny village in Malaysia about forty kilometres away from any major city.',
        operations: [
          {
            type: 'replace',
            end1: 4,
            end2: 4,
            start1: 3,
            start2: 3,
          },
          {
            type: 'delete',
            end1: 10,
            end2: 8,
            start1: 9,
            start2: 8,
          },
        ],
      },
      details: [
        {
          level: 'A1',
          word: 'So',
          pronunciation: 100,
        },
        {
          level: 'A1',
          word: 'my',
          pronunciation: 100,
        },
        {
          level: 'unknown',
          word: 'hometown',
          pronunciation: 85,
        },
        {
          level: 'A1',
          word: 'are',
          pronunciation: 92,
        },
        {
          level: 'A1',
          word: 'a',
          pronunciation: 100,
        },
        {
          level: 'A2',
          word: 'tiny',
          pronunciation: 100,
        },
        {
          level: 'A1',
          word: 'village',
          pronunciation: 100,
        },
        {
          level: 'A1',
          word: 'in',
          pronunciation: 100,
        },
        {
          level: 'unknown',
          word: 'Malaysia',
          pronunciation: 69,
        },
        {
          level: 'A1',
          word: 'in',
          pronunciation: 8,
        },
        {
          level: 'A1',
          word: 'about',
          pronunciation: 100,
        },
        {
          level: 'A1',
          word: 'forty',
          pronunciation: 83,
        },
        {
          level: 'A1',
          word: 'kilometres',
          pronunciation: 63,
        },
        {
          level: 'A1',
          word: 'away',
          pronunciation: 100,
        },
        {
          level: 'A1',
          word: 'from',
          pronunciation: 100,
        },
        {
          level: 'A1',
          word: 'any',
          pronunciation: 96,
        },
        {
          level: 'A1',
          word: 'major',
          pronunciation: 0,
        },
        {
          level: 'A1',
          word: 'city.',
          pronunciation: 68,
        },
      ],
    },
    {
      sentence: "Most people probably wouldn't be able to find them on maps.",
      grammar: {},
      details: [
        {
          level: 'A1',
          word: 'Most',
          pronunciation: 0,
        },
        {
          level: 'A1',
          word: 'people',
          pronunciation: 1,
        },
        {
          level: 'A1',
          word: 'probably',
          pronunciation: 58,
        },
        {
          level: 'unknown',
          word: "wouldn't",
          pronunciation: 20,
        },
        {
          level: 'A1',
          word: 'be',
          pronunciation: 100,
        },
        {
          level: 'A1',
          word: 'able',
          pronunciation: 100,
        },
        {
          level: 'A1',
          word: 'to',
          pronunciation: 100,
        },
        {
          level: 'A1',
          word: 'find',
          pronunciation: 100,
        },
        {
          level: 'A1',
          word: 'them',
          pronunciation: 98,
        },
        {
          level: 'A1',
          word: 'on',
          pronunciation: 86,
        },
        {
          level: 'A2',
          word: 'maps.',
          pronunciation: 100,
        },
      ],
    },
  ],
};

const conicColors: ProgressProps['strokeColor'] = {
  '0%': '#fea097',
  '50%': '#fcda6b',
  '100%': '#6cd53e',
};

const SpeakingAssessment = () => {
  return (
    <>
      <div className={styles.overview}>
        <div className={styles.overall}>
          <Progress
            type="circle"
            percent={DUMMY_DATA.overall * 10}
            strokeColor={conicColors}
            format={() => `${DUMMY_DATA.overall}`}
          />
          <p>Overall</p>
        </div>

        <div className={styles.score}>
          <div className={styles['score-label']}>
            <p>Fluency Coherence</p>
            <p>{DUMMY_DATA.fluency_coherence}/9</p>
          </div>
          <div className={styles['score-bar']}>
            <div
              style={{ width: `${(DUMMY_DATA.fluency_coherence * 270) / 9}px` }}
              className={styles['score-bar-value']}
            ></div>
          </div>

          <div className={styles['score-label']}>
            <p>Lexical Resource</p>
            <p>{DUMMY_DATA.lexical_resource}/9</p>
          </div>
          <div className={styles['score-bar']}>
            <div
              style={{ width: `${(DUMMY_DATA.lexical_resource * 270) / 9}px` }}
              className={styles['score-bar-value']}
            ></div>
          </div>

          <div className={styles['score-label']}>
            <p>Grammar</p>
            <p>{DUMMY_DATA.grammar}/9</p>
          </div>
          <div className={styles['score-bar']}>
            <div
              style={{ width: `${(DUMMY_DATA.grammar * 270) / 9}px` }}
              className={styles['score-bar-value']}
            ></div>
          </div>

          <div className={styles['score-label']}>
            <p>Pronunciation</p>
            <p>{DUMMY_DATA.pronunciation}/9</p>
          </div>
          <div className={styles['score-bar']}>
            <div
              style={{ width: `${(DUMMY_DATA.pronunciation * 270) / 9}px` }}
              className={styles['score-bar-value']}
            ></div>
          </div>
        </div>
      </div>

      <div className={styles.transcription}>
        {DUMMY_DATA.sentences.map((sentence, index) => (
          <p key={index}>
            {sentence.details.map((word, i) => {
              const isCorrected =
                sentence.grammar &&
                sentence.grammar.operations &&
                sentence.grammar.operations.some((op) => op.start2 === i);

              const isIncorrect =
                sentence.grammar &&
                sentence.grammar.operations &&
                sentence.grammar.operations.some((op) => op.start1 === i);

              const pronunciationClass =
                word.pronunciation > 80
                  ? styles.green
                  : word.pronunciation >= 50
                  ? styles.yellow
                  : styles.red;

              return (
                <span
                  key={i}
                  className={`${pronunciationClass} ${
                    isCorrected ? styles.corrected : ''
                  }`}
                >
                  {isIncorrect ? <del>{word.word}</del> : word.word}{' '}
                  {isIncorrect && isCorrected ? (
                    <span className={styles.correctedWord}>
                      {sentence.grammar.corrected?.split(' ')[i]}{' '}
                    </span>
                  ) : null}
                </span>
              );
            })}
          </p>
        ))}
      </div>
    </>
  );
};

export default SpeakingAssessment;
