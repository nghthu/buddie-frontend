'use client';

import styles from '@/styles/pages/tests/create/Create.module.scss';
import { Button, Card, Checkbox, InputNumber, Radio, Space, Tabs } from 'antd';
import { useState, useRef, useEffect } from 'react';
import {
  FormOutlined,
  OrderedListOutlined,
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  PictureOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { Form, Input, Select } from 'antd';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib';

const { Option } = Select;

const UpdateTest = (
    {params} : { params: { id: string } }
) => {
  const [currentTab, setCurrentTab] = useState('1');
  const [form] = Form.useForm();

  const fileInputRefPart = useRef<HTMLInputElement>(null);
  const audioFileInputRefPart = useRef<HTMLInputElement>(null);
  const [partSelectedFile, setPartSelectedFile] = useState<Array<File | null>>([
    null,
  ]);
  const [partSelectedAudioFile, setPartSelectedAudioFile] = useState<
    Array<File | null>
  >([null]);

  const fileInputRefQuestionGroup = useRef<HTMLInputElement>(null);
  const audioFileInputRefQuestionGroup = useRef<HTMLInputElement>(null);
  const [questionGroupSelectedFile, setQuestionGroupSelectedFile] = useState<
    Array<File | null>
  >([null]);
  const [questionGroupSelectedAudioFile, setQuestionGroupSelectedAudioFile] =
    useState<Array<File | null>>([null]);

  const fileInputRefQuestion = useRef<HTMLInputElement>(null);
  const audioFileInputRefQuestion = useRef<HTMLInputElement>(null);
  const [questionSelectedFile, setQuestionSelectedFile] = useState<
    Array<File | null>
  >([null]);
  const [questionSelectedAudioFile, setQuestionSelectedAudioFile] = useState<
    Array<File | null>
  >([null]);

  const [uploadedFileNames, setUploadedFileNames] = useState<{
    [key: string]: string | null;
  }>({});
  const [haveOptions, setHaveOptions] = useState<{
    [key: string]: boolean;
  }>({});
  const [haveChoices, setHaveChoices] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();
  const user = auth.currentUser;

  const getTestById = async () => {
    const token = await user?.getIdToken();
    console.log(params.id);
    const response = await fetch(`/api/tests/${params.id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log(result);
    return result.data;
  }

  useEffect(() => {
    const fetchTest = async () => {
      const test : Test = await getTestById();
      form.setFieldsValue(test);
      form.setFieldValue('tags', test.tags.join(' '));
    }

    fetchTest();
  }, []);

  const callUpdateTestAPI = async () => {
    const token = await user?.getIdToken();

    const formData = new FormData();
    formData.append('test', JSON.stringify(form.getFieldsValue()));

    if (form.getFieldValue('test_recording')) {
      formData.append('test_recording', form.getFieldValue('test_recording'));
    }

    partSelectedFile.forEach((file) => {
      if (file) {
        formData.append(`part_images`, file);
      }
    });

    partSelectedAudioFile.forEach((file) => {
      if (file) {
        formData.append(`part_recording`, file);
      }
    });

    questionGroupSelectedFile.forEach((file) => {
      if (file) {
        formData.append(`question_group_images`, file);
      }
    });

    questionGroupSelectedAudioFile.forEach((file) => {
      if (file) {
        formData.append(`question_group_recording`, file);
      }
    });

    questionSelectedFile.forEach((file) => {
      if (file) {
        formData.append(`question_images`, file);
      }
    });

    questionSelectedAudioFile.forEach((file) => {
      if (file) {
        formData.append(`question_recording`, file);
      }
    });

    const response = await fetch(`/api/tests/${params.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update test');
    }

    const result = await response.json();
    console.log(result);
    return result;
  };

  const handleOk = async () => {
    if (currentTab === '1') {
      await form.validateFields();
      const values = form.getFieldsValue();
      form.setFieldsValue({ tags: values.tags ? values.tags.split(' ') : [] });
      setCurrentTab('2');
    } else {
      await form.validateFields();
      callUpdateTestAPI();
      router.back();
    }
  };

  const handleCancel = () => {
    if (currentTab === '2') {
      setCurrentTab('1');
    } else {
      router.back();
    }
  };

  const handleTabChange = (key: string) => {
    setCurrentTab(key);
  };

  type Test = {
    test_name: string;
    test_type: string;
    access: string;
    duration: number;
    is_buddie_test: boolean;
    tags: Array<string>;
    test_recording: string | null;
    parts: Array<Part>;
  };

  type Part = {
    part_number: number;
    part_duration: number | null;
    part_recording: string | null;
    part_prompt: string;
    part_image_urls: string;
    question_groups: Array<QuestionGroup>;
  };

  type QuestionGroup = {
    is_single_question: boolean;
    question_groups_info: {
      question_groups_duration: number | null;
      question_groups_prompt: string;
      question_groups_recording: string | null;
      question_groups_image_urls: string;
    };
    questions: Array<Question>;
  };

  type Question = {
    question_number: number;
    question_type: string;
    question_prompt: string;
    question_image_urls: string;
    question_duration: number | null;
    question_preparation_time: number | null;
    question_recording: string | null;
  };

  const handleFileChangePart =
    (partIndex: number, type: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        form.setFieldsValue({
          parts: form
            .getFieldsValue()
            .parts.map((part: Part, index: number) => {
              if (index === partIndex) {
                return type === 'audio'
                  ? { ...part, part_recording: file }
                  : { ...part, part_image_urls: file };
              }
              return part;
            }),
        });

        const newUploadedFileNames = { ...uploadedFileNames };
        const key = `part_${partIndex + 1}_${type}`;
        newUploadedFileNames[key] = file.name;
        setUploadedFileNames(newUploadedFileNames);
      }

      console.log(form.getFieldsValue());
    };

  const handleFileChangeQuestionGroup =
    (partIndex: number, questionGroupIndex: number, type: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        form.setFieldsValue({
          parts: form
            .getFieldsValue()
            .parts.map((part: Part, index: number) => {
              if (index === partIndex) {
                return {
                  ...part,
                  question_groups: part.question_groups.map(
                    (questionGroup: QuestionGroup, i: number) => {
                      if (i === questionGroupIndex) {
                        return type === 'audio'
                          ? {
                              ...questionGroup,
                              question_groups_info: {
                                ...questionGroup.question_groups_info,
                                question_groups_recording: file,
                              },
                            }
                          : {
                              ...questionGroup,
                              question_groups_info: {
                                ...questionGroup.question_groups_info,
                                question_groups_image_urls: file,
                              },
                            };
                      }
                      return questionGroup;
                    }
                  ),
                };
              }
              return part;
            }),
        });

        const newUploadedFileNames = { ...uploadedFileNames };
        const key = `part_${partIndex + 1}_question_group_${
          questionGroupIndex + 1
        }_${type}`;
        newUploadedFileNames[key] = file.name;
        setUploadedFileNames(newUploadedFileNames);
      }
    };

  const handleFileChangeQuestion =
    (
      partIndex: number,
      questionGroupIndex: number,
      questionIndex: number,
      type: string
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        form.setFieldsValue({
          parts: form
            .getFieldsValue()
            .parts.map((part: Part, index: number) => {
              if (index === partIndex) {
                return {
                  ...part,
                  question_groups: part.question_groups.map(
                    (questionGroup: QuestionGroup, i: number) => {
                      if (i === questionGroupIndex) {
                        return {
                          ...questionGroup,
                          questions: questionGroup.questions.map(
                            (question: Question, j: number) => {
                              if (j === questionIndex) {
                                return type === 'audio'
                                  ? { ...question, question_recording: file }
                                  : { ...question, question_image_urls: file };
                              }
                              return question;
                            }
                          ),
                        };
                      }
                      return questionGroup;
                    }
                  ),
                };
              }
              return part;
            }),
        });

        const newUploadedFileNames = { ...uploadedFileNames };
        const key = `part_${partIndex + 1}_question_group_${
          questionGroupIndex + 1
        }_question_${questionIndex + 1}_${type}`;
        newUploadedFileNames[key] = file.name;
        setUploadedFileNames(newUploadedFileNames);
      }
    };

  useEffect(() => {}, [haveOptions, haveChoices, uploadedFileNames]);

  const handleQuestionTypeChange = (
    partIndex: number,
    questionGroupIndex: number,
    questionIndex: number,
    value: string
  ) => {
    const key = `part_${partIndex + 1}_question_group_${
      questionGroupIndex + 1
    }_question_${questionIndex + 1}`;

    if (value === 'selection' || value === 'single_choice') {
      setHaveOptions({ ...haveOptions, [key]: true });
      setHaveChoices({ ...haveChoices, [key]: false });
    } else if (value === 'multiple_choices') {
      setHaveOptions({ ...haveOptions, [key]: true });
      setHaveChoices({ ...haveChoices, [key]: true });
    } else {
      setHaveOptions({ ...haveOptions, [key]: false });
      setHaveChoices({ ...haveChoices, [key]: false });
    }
  };

  const items = [
    {
      key: '1',
      label: '1. Thông tin',
      icon: <FormOutlined />,
      disabled: currentTab === '2',
      children: (
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="test_name"
            label="Tên bài thi"
            rules={[{ required: true, message: 'Vui lòng nhập tên bài thi!' }]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            name="test_type"
            initialValue="custom"
            hidden
          >
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            name="access"
            label="Quyền truy cập"
            rules={[
              { required: true, message: 'Vui lòng chọn quyền truy cập!' },
            ]}
          >
            <Select>
              <Option value="private">Chỉ mình tôi</Option>
              <Option value="public">Cộng đồng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời gian (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            name="is_buddie_test"
            initialValue={false}
            hidden
          >
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="test_recording"
            initialValue={null}
            hidden
          >
            <Input type="hidden" />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: '2. Câu hỏi',
      icon: <OrderedListOutlined />,
      disabled: currentTab === '1',
      children: (
        <Form
          form={form}
          layout="vertical"
        >
          <Form.List name="parts">
            {(fields, { add, remove }) => (
              <div>
                {fields.map((field, index) => (
                  <Card
                    className={styles.oddCard}
                    size="small"
                    title={`Phần thi ${index + 1}`}
                    key={field.key}
                    extra={
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name);
                          fields.splice(index, 1);
                          fields.forEach((field, i) => {
                            form.setFieldsValue({
                              parts: {
                                ...form.getFieldsValue().parts,
                                [i]: {
                                  ...form.getFieldsValue().parts[i],
                                  part_number: i + 1,
                                },
                              },
                            });
                          });
                        }}
                      />
                    }
                  >
                    <Form.Item
                      name={[field.name, 'part_number']}
                      hidden
                    >
                      <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                      className={styles.prompt}
                      label="Tiêu đề Phần thi"
                      name={[field.name, 'part_prompt']}
                    >
                      <Input.TextArea placeholder="Tiêu đề Phần thi" />
                    </Form.Item>

                    {uploadedFileNames[`part_${index + 1}_audio`] && (
                      <div className={styles.uploadedFileName}>
                        {uploadedFileNames[`part_${index + 1}_audio`]}
                      </div>
                    )}

                    {uploadedFileNames[`part_${index + 1}_image`] && (
                      <div className={styles.uploadedFileName}>
                        {uploadedFileNames[`part_${index + 1}_image`]}
                      </div>
                    )}

                    <div className={styles.buttonsContainer}>
                      <Form.Item name={[field.name, 'part_recording']}>
                        <input
                          type="file"
                          ref={audioFileInputRefPart}
                          style={{ display: 'none' }}
                          onChange={handleFileChangePart(index, 'audio')}
                        />
                        <Button
                          type="text"
                          icon={<SoundOutlined />}
                          onClick={() => audioFileInputRefPart.current?.click()}
                        ></Button>
                      </Form.Item>
                      <Form.Item name={[field.name, 'part_image_urls']}>
                        <input
                          type="file"
                          ref={fileInputRefPart}
                          style={{ display: 'none' }}
                          onChange={handleFileChangePart(index, 'image')}
                        />
                        <Button
                          type="text"
                          icon={<PictureOutlined />}
                          onClick={() => fileInputRefPart.current?.click()}
                        />
                      </Form.Item>
                    </div>
                    <Form.Item
                      label="Thời gian làm bài (phút)"
                      name={[field.name, 'part_duration']}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.List name={[field.name, 'question_groups']}>
                      {(subFields, subOpt) => (
                        <div>
                          {subFields.map((subField) => (
                            <Card
                              size="small"
                              title={`Nhóm câu hỏi ${subField.name + 1}`}
                              key={subField.key}
                              extra={
                                <CloseOutlined
                                  onClick={() => {
                                    subOpt.remove(subField.name);
                                  }}
                                />
                              }
                            >
                              <Form.Item
                                name={[subField.name, 'is_single_question']}
                                hidden
                              >
                                <Input type="hidden" />
                              </Form.Item>

                              <Form.Item
                                className={styles.prompt}
                                label="Tiêu đề Nhóm câu hỏi"
                                name={[
                                  subField.name,
                                  'question_groups_info',
                                  'question_groups_prompt',
                                ]}
                              >
                                <Input.TextArea placeholder="Tiêu đề Nhóm câu hỏi..." />
                              </Form.Item>

                              {uploadedFileNames[
                                `part_${index + 1}_question_group_${
                                  subField.name + 1
                                }_audio`
                              ] && (
                                <div className={styles.uploadedFileName}>
                                  {
                                    uploadedFileNames[
                                      `part_${index + 1}_question_group_${
                                        subField.name + 1
                                      }_audio`
                                    ]
                                  }
                                </div>
                              )}

                              {uploadedFileNames[
                                `part_${index + 1}_question_group_${
                                  subField.name + 1
                                }_image`
                              ] && (
                                <div className={styles.uploadedFileName}>
                                  {
                                    uploadedFileNames[
                                      `part_${index + 1}_question_group_${
                                        subField.name + 1
                                      }_image`
                                    ]
                                  }
                                </div>
                              )}

                              <div className={styles.buttonsContainer}>
                                <Form.Item
                                  name={[
                                    subField.name,
                                    'question_groups_recording',
                                  ]}
                                >
                                  <input
                                    type="file"
                                    ref={audioFileInputRefQuestionGroup}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChangeQuestionGroup(
                                      index,
                                      subField.name,
                                      'audio'
                                    )}
                                  />
                                  <Button
                                    type="text"
                                    icon={<SoundOutlined />}
                                    onClick={() =>
                                      audioFileInputRefQuestionGroup.current?.click()
                                    }
                                  />
                                </Form.Item>
                                <Form.Item
                                  name={[
                                    subField.name,
                                    'question_groups_image_urls',
                                  ]}
                                >
                                  <input
                                    type="file"
                                    ref={fileInputRefQuestionGroup}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChangeQuestionGroup(
                                      index,
                                      subField.name,
                                      'image'
                                    )}
                                  />
                                  <Button
                                    type="text"
                                    icon={<PictureOutlined />}
                                    onClick={() =>
                                      fileInputRefQuestionGroup.current?.click()
                                    }
                                  />
                                </Form.Item>
                              </div>

                              <Form.Item
                                label="Thời gian làm bài (phút)"
                                name={[
                                  subField.name,
                                  'question_groups_info',
                                  'question_groups_duration',
                                ]}
                              >
                                <InputNumber min={1} />
                              </Form.Item>

                              <Form.List name={[subField.name, 'questions']}>
                                {(questionFields, questionOpt) => (
                                  <div>
                                    {questionFields.map((questionField) => (
                                      <Card
                                        size="small"
                                        title={`Câu hỏi ${
                                          questionField.name + 1
                                        }`}
                                        key={questionField.key}
                                        extra={
                                          <CloseOutlined
                                            onClick={() => {
                                              questionOpt.remove(
                                                questionField.name
                                              );
                                              setTimeout(() => {
                                                const updatedQuestions =
                                                  form.getFieldValue([
                                                    'parts',
                                                    field.name,
                                                    'question_groups',
                                                    subField.name,
                                                    'questions',
                                                  ]) as Array<unknown>;
                                                updatedQuestions.forEach(
                                                  (_, index) => {
                                                    form.setFieldsValue({
                                                      parts: {
                                                        ...form.getFieldsValue()
                                                          .parts,
                                                        [field.name]: {
                                                          ...form.getFieldsValue()
                                                            .parts[field.name],
                                                          question_groups: {
                                                            ...form.getFieldsValue()
                                                              .parts[field.name]
                                                              .question_groups,
                                                            [subField.name]: {
                                                              ...form.getFieldsValue()
                                                                .parts[
                                                                field.name
                                                              ].question_groups[
                                                                subField.name
                                                              ],
                                                              questions: {
                                                                ...form.getFieldsValue()
                                                                  .parts[
                                                                  field.name
                                                                ]
                                                                  .question_groups[
                                                                  subField.name
                                                                ].questions,
                                                                [index]: {
                                                                  ...form.getFieldsValue()
                                                                    .parts[
                                                                    field.name
                                                                  ]
                                                                    .question_groups[
                                                                    subField
                                                                      .name
                                                                  ].questions[
                                                                    index
                                                                  ],
                                                                  question_number:
                                                                    index + 1,
                                                                },
                                                              },
                                                              is_single_question:
                                                                updatedQuestions.length ===
                                                                1,
                                                            },
                                                          },
                                                        },
                                                      },
                                                    });
                                                  }
                                                );
                                              }, 0);
                                            }}
                                          />
                                        }
                                      >
                                        <Form.Item
                                          className={styles.prompt}
                                          label="Nội dung Câu hỏi"
                                          name={[
                                            questionField.name,
                                            'question_prompt',
                                          ]}
                                        >
                                          <Input.TextArea placeholder="Nội dung Câu hỏi..." />
                                        </Form.Item>

                                        {uploadedFileNames[
                                          `part_${index + 1}_question_group_${
                                            subField.name + 1
                                          }_question_${
                                            questionField.name + 1
                                          }_audio`
                                        ] && (
                                          <div>
                                            {
                                              uploadedFileNames[
                                                `part_${
                                                  index + 1
                                                }_question_group_${
                                                  subField.name + 1
                                                }_question_${
                                                  questionField.name + 1
                                                }_audio`
                                              ]
                                            }
                                          </div>
                                        )}

                                        {uploadedFileNames[
                                          `part_${index + 1}_question_group_${
                                            subField.name + 1
                                          }_question_${
                                            questionField.name + 1
                                          }_image`
                                        ] && (
                                          <div>
                                            {
                                              uploadedFileNames[
                                                `part_${
                                                  index + 1
                                                }_question_group_${
                                                  subField.name + 1
                                                }_question_${
                                                  questionField.name + 1
                                                }_image`
                                              ]
                                            }
                                          </div>
                                        )}

                                        <div
                                          className={styles.buttonsContainer}
                                        >
                                          <Form.Item
                                            name={[
                                              questionField.name,
                                              'question_recording',
                                            ]}
                                          >
                                            <input
                                              type="file"
                                              ref={audioFileInputRefQuestion}
                                              style={{ display: 'none' }}
                                              onChange={handleFileChangeQuestion(
                                                index,
                                                subField.name,
                                                questionField.name,
                                                'audio'
                                              )}
                                            />
                                            <Button
                                              type="text"
                                              icon={<SoundOutlined />}
                                              onClick={() =>
                                                audioFileInputRefQuestion.current?.click()
                                              }
                                            />
                                          </Form.Item>
                                          <Form.Item
                                            name={[
                                              field.name,
                                              'question_image_urls',
                                            ]}
                                          >
                                            <input
                                              type="file"
                                              ref={fileInputRefQuestion}
                                              style={{ display: 'none' }}
                                              onChange={handleFileChangeQuestion(
                                                index,
                                                subField.name,
                                                questionField.name,
                                                'image'
                                              )}
                                            />
                                            <Button
                                              type="text"
                                              icon={<PictureOutlined />}
                                              onClick={() =>
                                                fileInputRefQuestion.current?.click()
                                              }
                                            />
                                          </Form.Item>
                                        </div>

                                        <Form.Item
                                          label="Loại Câu hỏi"
                                          name={[
                                            questionField.name,
                                            'question_type',
                                          ]}
                                        >
                                          <Select
                                            onChange={(value) => {
                                              handleQuestionTypeChange(
                                                index,
                                                subField.name,
                                                questionField.name,
                                                value
                                              );
                                            }}
                                          >
                                            <Option value="selection">
                                              Lựa chọn
                                            </Option>
                                            <Option value="single_choice">
                                              Chọn một
                                            </Option>
                                            <Option value="multiple_choices">
                                              Chọn nhiều
                                            </Option>
                                            <Option value="speaking">
                                              Speaking
                                            </Option>
                                            <Option value="writing">
                                              Writing
                                            </Option>
                                          </Select>
                                        </Form.Item>

                                        <div className={styles.timeInput}>
                                          <Form.Item
                                            label="Thời gian Làm bài"
                                            name={[
                                              questionField.name,
                                              'question_duration',
                                            ]}
                                          >
                                            <InputNumber min={1} />
                                          </Form.Item>
                                        </div>

                                        {haveOptions[
                                          `part_${index + 1}_question_group_${
                                            subField.name + 1
                                          }_question_${questionField.name + 1}`
                                        ] &&
                                          haveChoices[
                                            `part_${index + 1}_question_group_${
                                              subField.name + 1
                                            }_question_${
                                              questionField.name + 1
                                            }`
                                          ] && (
                                            <Form.List
                                              name={[
                                                questionField.name,
                                                'options',
                                              ]}
                                            >
                                              {(fields, { add, remove }) => (
                                                <div
                                                  className={
                                                    styles.optionsContainer
                                                  }
                                                >
                                                  {fields.map(
                                                    (optionField, index) => (
                                                      <Space
                                                        key={optionField.key}
                                                        align="baseline"
                                                      >
                                                        <Form.Item>
                                                          <Checkbox
                                                            onChange={(e) => {
                                                              let answer =
                                                                form.getFieldValue(
                                                                  [
                                                                    'parts',
                                                                    field.name,
                                                                    'question_groups',
                                                                    subField.name,
                                                                    'questions',
                                                                    questionField.name,
                                                                    'answer',
                                                                  ]
                                                                ) || [];

                                                              if (
                                                                e.target.checked
                                                              ) {
                                                                answer.push(
                                                                  String(
                                                                    index + 1
                                                                  )
                                                                );
                                                              } else {
                                                                answer =
                                                                  answer.filter(
                                                                    (
                                                                      a: string
                                                                    ) =>
                                                                      a !==
                                                                      String(
                                                                        index +
                                                                          1
                                                                      )
                                                                  );
                                                              }

                                                              form.setFieldsValue(
                                                                {
                                                                  parts: {
                                                                    [field.name]:
                                                                      {
                                                                        question_groups:
                                                                          {
                                                                            [subField.name]:
                                                                              {
                                                                                questions:
                                                                                  {
                                                                                    [questionField.name]:
                                                                                      {
                                                                                        answer,
                                                                                      },
                                                                                  },
                                                                              },
                                                                          },
                                                                      },
                                                                  },
                                                                }
                                                              );
                                                            }}
                                                          ></Checkbox>
                                                        </Form.Item>

                                                        <Form.Item
                                                          {...optionField}
                                                          validateTrigger={[
                                                            'onChange',
                                                            'onBlur',
                                                          ]}
                                                          rules={[
                                                            {
                                                              required: true,
                                                              whitespace: true,
                                                              message:
                                                                'Vui lòng nhập hoặc xóa đáp án này.',
                                                            },
                                                          ]}
                                                          noStyle
                                                        >
                                                          <Input placeholder="Lựa chọn..." />
                                                        </Form.Item>

                                                        <MinusCircleOutlined
                                                          onClick={() =>
                                                            remove(
                                                              optionField.name
                                                            )
                                                          }
                                                        />
                                                      </Space>
                                                    )
                                                  )}

                                                  <Form.Item>
                                                    <Button
                                                      type="dashed"
                                                      onClick={() => add()}
                                                      block
                                                      icon={<PlusOutlined />}
                                                    >
                                                      Thêm Đáp án
                                                    </Button>
                                                  </Form.Item>
                                                </div>
                                              )}
                                            </Form.List>
                                          )}

                                        {haveOptions[
                                          `part_${index + 1}_question_group_${
                                            subField.name + 1
                                          }_question_${questionField.name + 1}`
                                        ] &&
                                          !haveChoices[
                                            `part_${index + 1}_question_group_${
                                              subField.name + 1
                                            }_question_${
                                              questionField.name + 1
                                            }`
                                          ] && (
                                            <Form.List
                                              name={[
                                                questionField.name,
                                                'options',
                                              ]}
                                            >
                                              {(fields, { add, remove }) => (
                                                <div>
                                                  <Radio.Group
                                                    onChange={(e) => {
                                                      const answer = String(
                                                        e.target.value
                                                      );
                                                      form.setFieldsValue({
                                                        parts: {
                                                          [field.name]: {
                                                            question_groups: {
                                                              [subField.name]: {
                                                                questions: {
                                                                  [questionField.name]:
                                                                    {
                                                                      answer,
                                                                    },
                                                                },
                                                              },
                                                            },
                                                          },
                                                        },
                                                      });
                                                    }}
                                                  >
                                                    <div
                                                      className={
                                                        styles.optionsContainer
                                                      }
                                                    >
                                                      {fields.map(
                                                        (
                                                          optionField,
                                                          index
                                                        ) => (
                                                          <Space
                                                            key={
                                                              optionField.key
                                                            }
                                                            align="baseline"
                                                          >
                                                            <Form.Item>
                                                              <Radio
                                                                value={
                                                                  index + 1
                                                                }
                                                              ></Radio>
                                                            </Form.Item>

                                                            <Form.Item
                                                              {...optionField}
                                                              validateTrigger={[
                                                                'onChange',
                                                                'onBlur',
                                                              ]}
                                                              rules={[
                                                                {
                                                                  required:
                                                                    true,
                                                                  whitespace:
                                                                    true,
                                                                  message:
                                                                    'Vui lòng nhập hoặc xóa đáp án này.',
                                                                },
                                                              ]}
                                                              noStyle
                                                            >
                                                              <Input placeholder="Lựa chọn..." />
                                                            </Form.Item>

                                                            <Form.Item>
                                                              <MinusCircleOutlined
                                                                onClick={() =>
                                                                  remove(
                                                                    optionField.name
                                                                  )
                                                                }
                                                              />
                                                            </Form.Item>
                                                          </Space>
                                                        )
                                                      )}
                                                    </div>
                                                  </Radio.Group>

                                                  <Form.Item>
                                                    <Button
                                                      type="dashed"
                                                      onClick={() => add()}
                                                      block
                                                      icon={<PlusOutlined />}
                                                    >
                                                      Thêm Đáp án
                                                    </Button>
                                                  </Form.Item>
                                                </div>
                                              )}
                                            </Form.List>
                                          )}
                                      </Card>
                                    ))}
                                    <Button
                                      type="dashed"
                                      icon={<PlusOutlined />}
                                      onClick={() => {
                                        questionOpt.add();
                                        setTimeout(() => {
                                          const updatedQuestions =
                                            form.getFieldValue([
                                              'parts',
                                              field.name,
                                              'question_groups',
                                              subField.name,
                                              'questions',
                                            ]) as Array<unknown>;
                                          updatedQuestions.forEach(
                                            (_, index) => {
                                              form.setFieldsValue({
                                                parts: {
                                                  ...form.getFieldsValue()
                                                    .parts,
                                                  [field.name]: {
                                                    ...form.getFieldsValue()
                                                      .parts[field.name],
                                                    question_groups: {
                                                      ...form.getFieldsValue()
                                                        .parts[field.name]
                                                        .question_groups,
                                                      [subField.name]: {
                                                        ...form.getFieldsValue()
                                                          .parts[field.name]
                                                          .question_groups[
                                                          subField.name
                                                        ],
                                                        questions: {
                                                          ...form.getFieldsValue()
                                                            .parts[field.name]
                                                            .question_groups[
                                                            subField.name
                                                          ].questions,
                                                          [index]: {
                                                            ...form.getFieldsValue()
                                                              .parts[field.name]
                                                              .question_groups[
                                                              subField.name
                                                            ].questions[index],
                                                            question_number:
                                                              index + 1,
                                                          },
                                                        },
                                                        is_single_question:
                                                          updatedQuestions.length ===
                                                          1,
                                                      },
                                                    },
                                                  },
                                                },
                                              });
                                            }
                                          );
                                        }, 0);
                                      }}
                                      block
                                    >
                                      Thêm Câu hỏi
                                    </Button>
                                  </div>
                                )}
                              </Form.List>
                            </Card>
                          ))}
                          <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => subOpt.add()}
                            block
                          >
                            Thêm Nhóm câu hỏi
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    add();
                    setTimeout(() => {
                      const updatedParts = form.getFieldValue(
                        'parts'
                      ) as Array<unknown>;
                      updatedParts.forEach((_, index) => {
                        form.setFieldsValue({
                          parts: {
                            ...form.getFieldsValue().parts,
                            [index]: {
                              ...form.getFieldsValue().parts[index],
                              part_number: index + 1,
                            },
                          },
                        });
                      });
                    }, 0);
                  }}
                  block
                >
                  Thêm Phần thi
                </Button>
              </div>
            )}
          </Form.List>
        </Form>
      ),
    },
  ];

  return (
    <div
      className={
        currentTab === '1' ? styles.tabOneContainer : styles.tabTwoContainer
      }
    >
      <h1 className={styles.title}>Cập nhật Đề thi</h1>

      <Tabs
        activeKey={currentTab}
        onChange={handleTabChange}
        type="card"
        items={items}
      ></Tabs>

      <div className={styles.buttonsContainer}>
        <Button
          danger
          ghost
          onClick={handleCancel}
        >
          {currentTab === '1' ? 'Hủy' : 'Quay lại'}
        </Button>
        <Button onClick={handleOk}>
          {currentTab === '1' ? 'Tiếp theo' : 'Cập nhật'}
        </Button>
      </div>
    </div>
  );
};

export default UpdateTest;