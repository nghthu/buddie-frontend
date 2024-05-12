'use client';

import TextCard from '@/components/TextCard';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  MinusCircleTwoTone,
  CheckOutlined,
} from '@ant-design/icons';
import styles from '@/styles/components/Result.module.scss';
import Card from '@/components/Card';
import { Button, Tabs, Modal } from 'antd';
import type { TabsProps } from 'antd';
import { useState } from 'react';
import merge from 'lodash/merge';
import clsx from 'clsx';

const test = {
  _id: '66275bf95c9a64df32c7ef52',
  test_name: 'IELTS Listening Practice Test 2022',
  test_type: 'ielts_listening',
  user_id: '123456789',
  duration: '2400',
  access: 'public',
  is_buddie_test: true,
  tags: ['IELTS', 'IELTS Listening', '2022'],
  test_recording:
    'https://media.intergreat.com/Audio/Mock_Test_2018/11/Practice%20Test%201.mp3',
  parts: [
    {
      part_number: '1',
      part_duration: null,
      part_recording: null,
      part_prompt: null,
      part_image_urls: null,
      question_groups: [
        {
          is_single_question: false,
          question_groups_info: {
            question_groups_duration: null,
            question_groups_prompt:
              'Circle the correct letter, A, B, C or D.\nExample\nWhat is Thomas’s new home phone number?\nA. 9731 4322\nB. 9813 4562\n(C). 9452 3456\nD, 9340 2367',
            question_groups_recording: null,
            question_groups_image_urls: null,
          },
          questions: [
            {
              question_number: '1',
              question_type: 'single_choice',
              question_prompt: null,
              question_image_urls: [
                'https://ieltsonlinetests.com/sites/default/files/fileman/Uploads/9/7/6.1.png',
              ],
              question_duration: null,
              answer: '1',
              options: ['Image A', 'Image B', 'Image C', 'Image D'],
              _id: '66275bf95c9a64df32c7ef55',
            },
            {
              question_number: '2',
              question_type: 'single_choice',
              question_prompt: null,
              question_image_urls: [
                'https://ieltsonlinetests.com/sites/default/files/fileman/Uploads/9/7/6.1%20(1).png',
              ],
              question_duration: null,
              answer: '1',
              options: ['Image A', 'Image B', 'Image C', 'Image D'],
              _id: '66275bf95c9a64df32c7ef56',
            },
            {
              question_number: '3',
              question_type: 'single_choice',
              question_prompt: 'When will Ken leave?',
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: [
                'now',
                "in ten minutes' time",
                "at 10 o'clock",
                'in 30 minutes',
              ],
              _id: '66275bf95c9a64df32c7ef57',
            },
            {
              question_number: '4',
              question_type: 'single_choice',
              question_prompt: null,
              question_image_urls: [
                'https://ieltsonlinetests.com/sites/default/files/fileman/Uploads/9/7/6.2.png',
              ],
              question_duration: null,
              answer: '1',
              options: ['Image A', 'Image B', 'Image C', 'Image D'],
              _id: '66275bf95c9a64df32c7ef58',
            },
            {
              question_number: '5',
              question_type: 'single_choice',
              question_prompt: 'How many people will they meet there?',
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: ['none', 'three', 'tow', 'a group'],
              _id: '66275bf95c9a64df32c7ef59',
            },
            {
              question_number: '6',
              question_type: 'single_choice',
              question_prompt: 'How much will the evening cost?',
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: [
                'nothing',
                'hust the fares',
                'less than $40.00',
                'more than $40.00',
              ],
              _id: '66275bf95c9a64df32c7ef5a',
            },
            {
              question_number: '7',
              question_type: 'single_choice',
              question_prompt: 'What time does Megan plan to come home?',
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: [
                'before midnight',
                'after midnight',
                'on the last bus',
                'tomorrow morning',
              ],
              _id: '66275bf95c9a64df32c7ef5b',
            },
          ],
          _id: '66275bf95c9a64df32c7ef54',
        },
        {
          is_single_question: false,
          question_groups_info: {
            question_groups_duration: null,
            question_groups_prompt: 'Write ONE NUMBER for each answer',
            question_groups_recording: null,
            question_groups_image_urls: [
              'https://up-anh.vi-vn.vn/img/1712072332_83ea195c88141d53693e5a7dcf192829.png',
            ],
          },
          questions: [
            {
              question_number: '8',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '8',
              options: null,
              _id: '66275bf95c9a64df32c7ef5d',
            },
            {
              question_number: '9',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '9',
              options: null,
              _id: '66275bf95c9a64df32c7ef5e',
            },
            {
              question_number: '10',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '10',
              options: null,
              _id: '66275bf95c9a64df32c7ef5f',
            },
          ],
          _id: '66275bf95c9a64df32c7ef5c',
        },
      ],
      _id: '66275bf95c9a64df32c7ef53',
    },
    {
      part_number: '2',
      part_duration: null,
      part_recording: null,
      part_prompt: null,
      part_image_urls: null,
      question_groups: [
        {
          is_single_question: false,
          question_groups_info: {
            question_groups_duration: null,
            question_groups_prompt:
              'Complete the notes below.\nWrite NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
            question_groups_recording: null,
            question_groups_image_urls: [
              'https://up-anh.vi-vn.vn/img/1712072610_112b8023b8d25c44d1267abd45048c41.png',
            ],
          },
          questions: [
            {
              question_number: '11',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '11',
              options: null,
              _id: '66275bf95c9a64df32c7ef62',
            },
            {
              question_number: '12',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '12',
              options: null,
              _id: '66275bf95c9a64df32c7ef63',
            },
            {
              question_number: '13',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '13',
              options: null,
              _id: '66275bf95c9a64df32c7ef64',
            },
            {
              question_number: '14',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '14',
              options: null,
              _id: '66275bf95c9a64df32c7ef65',
            },
            {
              question_number: '15',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '15',
              options: null,
              _id: '66275bf95c9a64df32c7ef66',
            },
            {
              question_number: '16',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '16',
              options: null,
              _id: '66275bf95c9a64df32c7ef67',
            },
          ],
          _id: '66275bf95c9a64df32c7ef61',
        },
        {
          is_single_question: false,
          question_groups_info: {
            question_groups_duration: null,
            question_groups_prompt:
              'Complete the sentences below.\nWrite NO MORE THAN TWO WORDS for each answer.',
            question_groups_recording: null,
            question_groups_image_urls: [
              'https://up-anh.vi-vn.vn/img/1712072824_7396da9e80b4349728e22c90e3d98b14.png',
            ],
          },
          questions: [
            {
              question_number: '17',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '17',
              options: null,
              _id: '66275bf95c9a64df32c7ef69',
            },
            {
              question_number: '18',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '18',
              options: null,
              _id: '66275bf95c9a64df32c7ef6a',
            },
          ],
          _id: '66275bf95c9a64df32c7ef68',
        },
        {
          is_single_question: false,
          question_groups_info: {
            question_groups_duration: null,
            question_groups_prompt:
              'Complete this baggage label.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
            question_groups_recording: null,
            question_groups_image_urls: [
              'https://up-anh.vi-vn.vn/img/1712072997_84a980d531ddbe7805002ac179574f15.png',
            ],
          },
          questions: [
            {
              question_number: '19',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '19',
              options: null,
              _id: '66275bf95c9a64df32c7ef6c',
            },
            {
              question_number: '20',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '20',
              options: null,
              _id: '66275bf95c9a64df32c7ef6d',
            },
          ],
          _id: '66275bf95c9a64df32c7ef6b',
        },
      ],
      _id: '66275bf95c9a64df32c7ef60',
    },
    {
      part_number: '3',
      part_duration: null,
      part_recording: null,
      part_prompt: null,
      part_image_urls: null,
      question_groups: [
        {
          is_single_question: false,
          question_groups_info: {
            question_groups_duration: null,
            question_groups_prompt:
              'Complete the sentences below.\nWrite NO MORE THAN THREE WORDS for each answer.',
            question_groups_recording: null,
            question_groups_image_urls: [
              'https://up-anh.vi-vn.vn/img/1712073126_11092aeffae09befc7b1d593afc91c22.png',
            ],
          },
          questions: [
            {
              question_number: '21',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '21',
              options: null,
              _id: '66275bf95c9a64df32c7ef70',
            },
            {
              question_number: '22',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '22',
              options: null,
              _id: '66275bf95c9a64df32c7ef71',
            },
            {
              question_number: '23',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '23',
              options: null,
              _id: '66275bf95c9a64df32c7ef72',
            },
            {
              question_number: '24',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '24',
              options: null,
              _id: '66275bf95c9a64df32c7ef73',
            },
            {
              question_number: '25',
              question_type: 'completion',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '25',
              options: null,
              _id: '66275bf95c9a64df32c7ef74',
            },
          ],
          _id: '66275bf95c9a64df32c7ef6f',
        },
        {
          is_single_question: false,
          question_groups_info: {
            question_groups_duration: null,
            question_groups_prompt:
              'Which students can join the following activities?\nWrite the correct letter, A, B or C, next to questions 26-30.',
            question_groups_recording: null,
            question_groups_image_urls: [
              'https://up-anh.vi-vn.vn/img/1712073316_9cca865904b1392ef7c23db00b68b799.png',
            ],
          },
          questions: [
            {
              question_number: '26',
              question_type: 'selection',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: ['A', 'B', 'C'],
              _id: '66275bf95c9a64df32c7ef76',
            },
            {
              question_number: '27',
              question_type: 'selection',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: ['A', 'B', 'C'],
              _id: '66275bf95c9a64df32c7ef77',
            },
            {
              question_number: '28',
              question_type: 'selection',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: ['A', 'B', 'C'],
              _id: '66275bf95c9a64df32c7ef78',
            },
            {
              question_number: '29',
              question_type: 'selection',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: ['A', 'B', 'C'],
              _id: '66275bf95c9a64df32c7ef79',
            },
            {
              question_number: '30',
              question_type: 'selection',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: ['A', 'B', 'C'],
              _id: '66275bf95c9a64df32c7ef7a',
            },
          ],
          _id: '66275bf95c9a64df32c7ef75',
        },
      ],
      _id: '66275bf95c9a64df32c7ef6e',
    },
    {
      part_number: '4',
      part_duration: null,
      part_recording: null,
      part_prompt: null,
      part_image_urls: null,
      question_groups: [
        {
          is_single_question: false,
          question_groups_info: {
            question_groups_duration: null,
            question_groups_prompt: 'Choose the correct letter, A, B, C or D.',
            question_groups_recording: null,
            question_groups_image_urls: null,
          },
          questions: [
            {
              question_number: '31',
              question_type: 'single_choice',
              question_prompt: 'Most postgraduate students are studying',
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: [
                'courses that feature vocational training.',
                'full-time courses.',
                'part-time courses.',
                'research-based courses.',
              ],
              _id: '66275bf95c9a64df32c7ef7d',
            },
            {
              question_number: '32',
              question_type: 'single_choice',
              question_prompt: 'Postgraduate students are advised to',
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: [
                'take as many diverse subjects as possible',
                'accept an intellectual challenge.',
                'be sure to have a definite goal.',
                'have already completed training.',
              ],
              _id: '66275bf95c9a64df32c7ef7e',
            },
            {
              question_number: '33',
              question_type: 'single_choice',
              question_prompt: 'The speaker says that where you study',
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: [
                'is of minimal importance.',
                'must be somewhere you like.',
                'must be reasonably priced.',
                'should be based on your course.',
              ],
              _id: '66275bf95c9a64df32c7ef7f',
            },
            {
              question_number: '34',
              question_type: 'single_choice',
              question_prompt:
                'Choosing an institution should be mainly based on',
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: [
                'the quality of the housing for postgraduate students.',
                'the reputation of the department they work in.',
                'the reputation of the organisation they attend.',
                'the quality of the supervision they receive.',
              ],
              _id: '66275bf95c9a64df32c7ef80',
            },
            {
              question_number: '35',
              question_type: 'single_choice',
              question_prompt:
                'In terms of available facilities, the speaker places more importance on',
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: [
                'libraries and laboratories.',
                'computer support.',
                'secretarial services.',
                'the working environment.',
              ],
              _id: '66275bf95c9a64df32c7ef81',
            },
            {
              question_number: '36',
              question_type: 'single_choice',
              question_prompt:
                'The experience of a postgraduate is different because',
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: [
                'of higher living expenses.',
                'of the moderate work load.',
                'the majority of students are younger.',
                'course deadlines are stricter.',
              ],
              _id: '66275bf95c9a64df32c7ef82',
            },
            {
              question_number: '37',
              question_type: 'single_choice',
              question_prompt: 'Postgraduates can avoid feeling alone by',
              question_image_urls: null,
              question_duration: null,
              answer: '1',
              options: [
                'discussing any problems with a medical professional',
                'joining associations of their peers.',
                'participating in outside community activities.',
                'getting in touch with the student union..',
              ],
              _id: '66275bf95c9a64df32c7ef83',
            },
          ],
          _id: '66275bf95c9a64df32c7ef7c',
        },
        {
          is_single_question: false,
          question_groups_info: {
            question_groups_duration: null,
            question_groups_prompt:
              "Which THREE things does the speaker mention in relation to a postgraduate's financial situation?",
            question_groups_recording: null,
            question_groups_image_urls: null,
          },
          questions: [
            {
              question_number: '38',
              question_type: 'multiple_choices',
              question_prompt: null,
              question_image_urls: null,
              question_duration: null,
              answer: ['1', '2', '3'],
              options: [
                'postgraduates are not eligible for government student loans',
                'banks provide facilities for overdrafts',
                "Studies are funded from student's own income",
                'funding can be sourced from charities',
                'extra fees are covered by the institutions',
                'institutions do not provide financial support',
                'living costs are included in their fees',
              ],
              _id: '66275bf95c9a64df32c7ef85',
            },
          ],
          _id: '66275bf95c9a64df32c7ef84',
        },
      ],
      _id: '66275bf95c9a64df32c7ef7b',
    },
  ],
  created_at: { $date: { $numberLong: '1713855481665' } },
  updated_at: { $date: { $numberLong: '1713855481665' } },
  __v: '0',
};

const testSubmission = {
  _id: '662f6746b1ea7ab9dcf4ea3e',
  user_id: 'lgAFcQ07O0bPseHinceRyPFHR432',
  test_id: '66275bf95c9a64df32c7ef52',
  question_count: 40,
  correct_answer_count: 7,
  score: 2,
  parts: [
    {
      question_groups: [
        {
          questions: [
            {
              answer_result: {
                user_answer: '1',
                assess: true,
                is_correct: true,
              },
              _id: '66275bf95c9a64df32c7ef55',
            },
            {
              answer_result: {
                user_answer: '1',
                assess: true,
                is_correct: true,
              },
              _id: '66275bf95c9a64df32c7ef56',
            },
            {
              answer_result: {
                user_answer: '1',
                assess: true,
                is_correct: true,
              },
              _id: '66275bf95c9a64df32c7ef57',
            },
            {
              answer_result: {
                user_answer: '1',
                assess: true,
                is_correct: true,
              },
              _id: '66275bf95c9a64df32c7ef58',
            },
            {
              answer_result: {
                user_answer: '1',
                assess: true,
                is_correct: true,
              },
              _id: '66275bf95c9a64df32c7ef59',
            },
            {
              answer_result: {
                user_answer: '1',
                assess: true,
                is_correct: true,
              },
              _id: '66275bf95c9a64df32c7ef5a',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef5b',
            },
          ],
          _id: '66275bf95c9a64df32c7ef54',
        },
        {
          questions: [
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef5d',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef5e',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef5f',
            },
          ],
          _id: '66275bf95c9a64df32c7ef5c',
        },
      ],
      _id: '66275bf95c9a64df32c7ef53',
    },
    {
      question_groups: [
        {
          questions: [
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef62',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef63',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef64',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef65',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef66',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef67',
            },
          ],
          _id: '66275bf95c9a64df32c7ef61',
        },
        {
          questions: [
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef69',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef6a',
            },
          ],
          _id: '66275bf95c9a64df32c7ef68',
        },
        {
          questions: [
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef6c',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef6d',
            },
          ],
          _id: '66275bf95c9a64df32c7ef6b',
        },
      ],
      _id: '66275bf95c9a64df32c7ef60',
    },
    {
      question_groups: [
        {
          questions: [
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef70',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef71',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef72',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef73',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef74',
            },
          ],
          _id: '66275bf95c9a64df32c7ef6f',
        },
        {
          questions: [
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef76',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef77',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef78',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef79',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef7a',
            },
          ],
          _id: '66275bf95c9a64df32c7ef75',
        },
      ],
      _id: '66275bf95c9a64df32c7ef6e',
    },
    {
      question_groups: [
        {
          questions: [
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef7d',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef7e',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef7f',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef80',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef81',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef82',
            },
            {
              answer_result: {
                user_answer: '3',
                assess: true,
                is_correct: false,
              },
              _id: '66275bf95c9a64df32c7ef83',
            },
          ],
          _id: '66275bf95c9a64df32c7ef7c',
        },
        {
          questions: [
            {
              answer_result: {
                user_answer: ['1', '2', '3'],
                assess: true,
                is_correct: true,
              },
              _id: '66275bf95c9a64df32c7ef85',
            },
          ],
          _id: '66275bf95c9a64df32c7ef84',
        },
      ],
      _id: '66275bf95c9a64df32c7ef7b',
    },
  ],
  created_at: '2024-04-29T09:24:22.699Z',
  updated_at: '2024-04-29T09:24:22.699Z',
  __v: 0,
};

const Result = ({ test, testSubmission }) => {
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const testResultData = merge({}, test, testSubmission);

  let resultInfo = { right: 0, wrong: 0, skipped: 0 };

  const showModal = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const items: TabsProps['items'] = testResultData.parts.map((part, index) => {
    const allQuestionsInfo = part.question_groups
      .map((questionGroup) => questionGroup.questions)
      .flat();

    allQuestionsInfo.forEach((question) => {
      if (question.answer_result.is_correct) {
        resultInfo.right++;
      } else if (question.answer_result.user_answer === undefined) {
        resultInfo.skipped++;
      } else {
        resultInfo.wrong++;
      }
    });

    return {
      key: index,
      label: `Part ${part.part_number}`,
      children: (
        <Card
          key={index}
          width="100%"
          height="fit-content"
          className={styles['answer-board']}
        >
          {allQuestionsInfo.map((question, index) => (
            <div
              key={question._id}
              className={styles.answer}
            >
              <p>Câu{question.question_number}:</p>
              {(question.question_type === 'single_choice' ||
                question.question_type === 'selection') &&
                question.options &&
                question.options.map((option, index) => (
                  <div
                    key={index}
                    className={styles['radio-label']}
                  >
                    <span>{index + 1}</span>
                    <div
                      className={`${styles['radio-button']} ${
                        question.answer_result.is_correct
                          ? question.answer === String(index + 1)
                            ? styles['green']
                            : ''
                          : (index + 1).toString() ===
                            question.answer_result.user_answer
                          ? styles['red']
                          : (index + 1).toString() === question.answer
                          ? styles['green']
                          : ''
                      }`}
                    ></div>
                  </div>
                ))}
              {question.question_type === 'completion' && (
                <>
                  <TextCard
                    width="fit-content"
                    height="30px"
                    className={`${styles['answer-field']} ${
                      question.answer_result.is_correct
                        ? styles['green-border']
                        : styles['red-border']
                    }`}
                  >
                    {question.answer_result.user_answer}
                  </TextCard>
                </>
              )}
              {question.question_type === 'multiple_choices' &&
                question.options &&
                question.options.map((option, index) => (
                  <div
                    key={index}
                    className={styles['radio-label']}
                  >
                    <span>{index + 1}</span>
                    <div
                      className={`${styles['check-box-button']} ${
                        question.answer.includes(String(index + 1))
                          ? styles['green']
                          : question.answer_result.user_answer.includes(
                              String(index + 1)
                            )
                          ? styles['red']
                          : ''
                      }
                    }`}
                    >
                      {question.answer.includes(String(index + 1)) &&
                        question.answer_result.user_answer.includes(
                          String(index + 1)
                        ) && (
                          <CheckOutlined
                            style={{ width: '10px', color: 'green' }}
                          />
                        )}
                    </div>
                  </div>
                ))}
              <Button
                type="text"
                onClick={() => showModal(question.question_number)}
                block
              >
                Chi tiết
              </Button>
            </div>
          ))}
        </Card>
      ),
    };
  });

  return (
    <>
      <div className={styles['result-board']}>
        <TextCard
          width="150px"
          height="fit-content"
          className={styles['result-card']}
        >
          <CheckCircleTwoTone
            twoToneColor="#52c41a"
            style={{ fontSize: '18px' }}
          />
          <h4 className={styles['correct-header']}>Trả lời đúng</h4>
          <p>{resultInfo.right}</p>
        </TextCard>
        <TextCard
          width="150px"
          height="fit-content"
          className={styles['result-card']}
        >
          <CloseCircleTwoTone
            twoToneColor="#c41a1a"
            style={{ fontSize: '18px' }}
          />
          <h4 className={styles['wrong-header']}>Trả lời sai</h4>
          <p>{resultInfo.wrong}</p>
        </TextCard>
        <TextCard
          width="150px"
          height="fit-content"
          className={styles['result-card']}
        >
          <MinusCircleTwoTone
            twoToneColor="#8e958e"
            style={{ fontSize: '18px' }}
          />
          <h4 className={styles['skipped-header']}>Bỏ qua</h4>
          <p>{resultInfo.skipped}</p>
        </TextCard>
      </div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        // onChange={tabChangeHandler}
        className={styles.tab}
      />
      <Modal
        open={open}
        title={`Câu ${currentQuestion}`}
        onCancel={handleCancel}
        footer={[]}
        style={{ height: 'auto' }}
      >
        {testResultData.parts.map((part) =>
          part.question_groups.map((questionGroup) => {
            return questionGroup.questions.map((question) =>
              question.question_number === currentQuestion.toString() ? (
                <div key={question._id}>
                  <p className={styles['question-prompt']}>
                    {questionGroup.question_groups_info.question_groups_prompt}
                  </p>
                  {questionGroup.question_groups_info
                    .question_groups_image_urls && (
                    <img
                      className={styles.img}
                      src={
                        questionGroup.question_groups_info
                          .question_groups_image_urls[0]
                      }
                      alt="question"
                    />
                  )}
                  <p className={styles['question-prompt']}>
                    {question.question_prompt}
                  </p>
                  {question.question_image_urls && (
                    <img
                      className={styles.img}
                      src={question.question_image_urls[0]}
                      alt="question"
                    />
                  )}
                  <div className={clsx(styles['answer-options'])}>
                    {(question.question_type === 'single_choice' ||
                      question.question_type === 'selection') &&
                      question.options &&
                      question.options.map((option, index) => (
                        <div
                          key={index}
                          className={styles['radio-label']}
                        >
                          <div
                            className={`${styles['radio-button']} ${
                              question.answer_result.is_correct
                                ? question.answer === String(index + 1)
                                  ? styles['green']
                                  : ''
                                : (index + 1).toString() ===
                                  question.answer_result.user_answer
                                ? styles['red']
                                : (index + 1).toString() === question.answer
                                ? styles['green']
                                : ''
                            }`}
                          ></div>
                          <span>{option}</span>
                        </div>
                      ))}

                    {question.question_type === 'completion' && (
                      <>
                        <div className={styles['fill-answer']}>
                          <p>Your answer:</p>
                          <TextCard
                            width="fit-content"
                            height="30px"
                            className={`${styles['answer-field']} ${
                              question.answer_result.is_correct
                                ? styles['green-border']
                                : styles['red-border']
                            }`}
                          >
                            {question.answer_result.user_answer}
                          </TextCard>
                        </div>
                        {!question.answer_result.is_correct && (
                          <div className={styles['fill-answer']}>
                            <p>Correct answer:</p>
                            <TextCard
                              width="fit-content"
                              height="30px"
                              className={`${styles['answer-field']} ${styles['green-border']}`}
                            >
                              {question.answer}
                            </TextCard>
                          </div>
                        )}
                      </>
                    )}
                    {question.question_type === 'multiple_choices' &&
                      question.options &&
                      question.options.map((option, index) => (
                        <div
                          key={index}
                          className={styles['radio-label']}
                        >
                          <div
                            className={`${styles['check-box-button']} ${
                              question.answer.includes(String(index + 1))
                                ? styles['green']
                                : question.answer_result.user_answer.includes(
                                    String(index + 1)
                                  )
                                ? styles['red']
                                : ''
                            }
                    }`}
                          >
                            {question.answer.includes(String(index + 1)) &&
                              question.answer_result.user_answer.includes(
                                String(index + 1)
                              ) && (
                                <CheckOutlined
                                  style={{ width: '10px', color: 'green' }}
                                />
                              )}
                          </div>
                          <span>{option}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ) : null
            );
          })
        )}
      </Modal>
    </>
  );
};

export default Result;
