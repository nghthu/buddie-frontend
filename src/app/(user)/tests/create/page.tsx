'use client';

import styles from '@/styles/pages/tests/create/create.module.scss';
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
import { useRouter } from 'next/navigation';
import { auth } from '@/lib';
import { mutate } from 'swr';
import type { InputRef } from 'antd';
import { Flex, Input, Tag, theme, Tooltip, Select, Form } from 'antd';

const tagInputStyle: React.CSSProperties = {
  width: 64,
  height: 22,
  marginInlineEnd: 8,
  verticalAlign: 'top',
};

const { Option } = Select;

const CreateTest = () => {
  const [currentTab, setCurrentTab] = useState('1');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
  const { token: themeToken } = theme.useToken();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  const router = useRouter();
  const user = auth.currentUser;

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchAdminStatus() {
      const tokenResult = await user?.getIdTokenResult();
      const isAdmin = tokenResult?.claims.admin;
      setIsAdmin(!!isAdmin);
    }

    fetchAdminStatus();
  }, []);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setEditInputValue('');
  };

  const tagPlusStyle: React.CSSProperties = {
    height: 22,
    background: themeToken.colorBgContainer,
    borderStyle: 'dashed',
  };

  const callCreateTestAPI = async () => {
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

    const response = await fetch(`/api/tests`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create test');
    }

    const result = await response.json();
    console.log(result);
    mutate(`/api/tests?page=1&search=''&limit=10&isbuddie=false`);
    setTimeout(() => {
      setLoading(false);
      router.push('/tests');
    }, 5000);
  };

  const handleOk = async () => {
    await form.validateFields();

    if (currentTab === '1') {
      if (!isAdmin) {
        form.setFieldsValue({ test_type: 'custom' });
      }
      form.setFieldsValue({ tags: tags });
      setCurrentTab('2');
    } else {
      setLoading(true);
      callCreateTestAPI();
    }
  };

  const handleCancel = () => {
    if (currentTab === '2') {
      setCurrentTab('1');
    } else {
      router.push('/tests');
    }
  };

  const handleTabChange = (key: string) => {
    setCurrentTab(key);
  };

  // type Part = {
  //   part_number: number;
  //   part_duration: number | null;
  //   part_prompt: string;
  //   question_groups: Array<QuestionGroup>;
  // };

  // type QuestionGroup = {
  //   is_single_question: boolean;
  //   question_groups_info: {
  //     question_groups_duration: number | null;
  //     question_groups_prompt: string;
  //   };
  //   questions: Array<Question>;
  // };

  // type Question = {
  //   question_number: number;
  //   question_type: string;
  //   question_prompt: string;
  //   question_duration: number | null;
  //   question_preparation_time: number | null;
  // };

  const handleFileChangePart =
    (partIndex: number, type: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const originalFile = event.target.files?.[0];
      if (originalFile) {
        // Extract file extension
        const fileExtension = originalFile.name.split('.').pop();
        // Construct new file name
        const newFileName =
          type == 'audio'
            ? `part_recording-${partIndex + 1}.${fileExtension}`
            : `part_image-${partIndex + 1}-1.${fileExtension}`;
        // Create a new File object with the new name
        const file = new File([originalFile], newFileName, {
          type: originalFile.type,
        });

        if (type === 'audio') {
          setPartSelectedAudioFile([...partSelectedAudioFile, file]);
        } else {
          setPartSelectedFile([...partSelectedFile, file]);
        }

        const newUploadedFileNames = { ...uploadedFileNames };
        const key = `part_${partIndex + 1}_${type}`;
        newUploadedFileNames[key] = file.name;
        setUploadedFileNames(newUploadedFileNames);
      }
    };

  const handleFileChangeQuestionGroup =
    (partIndex: number, questionGroupIndex: number, type: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const originalFile = event.target.files?.[0];
      if (originalFile) {
        // Extract file extension
        const fileExtension = originalFile.name.split('.').pop();
        // Construct new file name
        const newFileName =
          type == 'audio'
            ? `question_group_recording-${partIndex + 1}-${
                questionGroupIndex + 1
              }.${fileExtension}`
            : `question_group_image-${partIndex + 1}-${
                questionGroupIndex + 1
              }-1.${fileExtension}`;
        // Create a new File object with the new name
        const file = new File([originalFile], newFileName, {
          type: originalFile.type,
        });

        if (type === 'audio') {
          setQuestionGroupSelectedAudioFile([
            ...questionGroupSelectedAudioFile,
            file,
          ]);
        } else {
          setQuestionGroupSelectedFile([...questionGroupSelectedFile, file]);
        }

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
      const originalFile = event.target.files?.[0];
      if (originalFile) {
        // Extract file extension
        const fileExtension = originalFile.name.split('.').pop();
        // Construct new file name
        const newFileName =
          type === 'audio'
            ? `question_recording-${partIndex + 1}-${questionGroupIndex + 1}-${
                questionIndex + 1
              }.${fileExtension}`
            : `question_image-${partIndex + 1}-${questionGroupIndex + 1}-${
                questionIndex + 1
              }-1.${fileExtension}`;
        // Create a new File object with the new name
        const file = new File([originalFile], newFileName, {
          type: originalFile.type,
        });

        if (type === 'audio') {
          setQuestionSelectedAudioFile([...questionSelectedAudioFile, file]);
        } else {
          setQuestionSelectedFile([...questionSelectedFile, file]);
        }

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
            <Input placeholder="Tên bài thi..." />
          </Form.Item>

          {isAdmin ? (
            <Form.Item
              name="test_type"
              label="Loại bài thi"
              rules={[
                { required: true, message: 'Vui lòng chọn loại bài thi!' },
              ]}
            >
              <Select>
                <Select.Option value="ielts_reading">
                  IELTS Reading
                </Select.Option>
                <Select.Option value="ielts_listening">
                  IELTS Listening
                </Select.Option>
                <Select.Option value="ielts_speaking">
                  IELTS Speaking
                </Select.Option>
                <Select.Option value="ielts_writing">
                  IELTS Writing
                </Select.Option>
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              name="test_type"
              hidden
            >
              <Input type="hidden" />
            </Form.Item>
          )}

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
            <Flex
              gap="4px 0"
              wrap
            >
              {tags.map<React.ReactNode>((tag, index) => {
                if (editInputIndex === index) {
                  return (
                    <Input
                      ref={editInputRef}
                      key={tag}
                      size="small"
                      style={tagInputStyle}
                      value={editInputValue}
                      onChange={handleEditInputChange}
                      onBlur={handleEditInputConfirm}
                      onPressEnter={handleEditInputConfirm}
                    />
                  );
                }
                const isLongTag = tag.length > 20;
                const tagElem = (
                  <Tag
                    color="cyan"
                    key={tag}
                    closable={index !== 0}
                    style={{ userSelect: 'none' }}
                    onClose={() => handleClose(tag)}
                  >
                    <span
                      onDoubleClick={(e) => {
                        if (index !== 0) {
                          setEditInputIndex(index);
                          setEditInputValue(tag);
                          e.preventDefault();
                        }
                      }}
                    >
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </span>
                  </Tag>
                );
                return isLongTag ? (
                  <Tooltip
                    title={tag}
                    key={tag}
                  >
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                );
              })}
              {inputVisible ? (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  style={tagInputStyle}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              ) : (
                <Tag
                  style={tagPlusStyle}
                  icon={<PlusOutlined />}
                  onClick={showInput}
                >
                  Tag mới
                </Tag>
              )}
            </Flex>
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
          initialValues={{
            parts: [
              {
                part_number: 1,
                part_duration: null,
                part_prompt: '',
                part_recording: null,
                part_image_urls: [],
                question_groups: [
                  {
                    is_single_question: true,
                    question_groups_info: {
                      question_groups_duration: null,
                      question_groups_prompt: '',
                      question_groups_recording: null,
                      question_groups_image_urls: [],
                    },
                    questions: [
                      {
                        question_number: 1,
                        question_type: '',
                        question_prompt: '',
                        question_duration: null,
                        question_preparation_time: null,
                        question_recording: null,
                        question_image_urls: [],
                      },
                    ],
                  },
                ],
              },
            ],
          }}
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
                      label="Nội dung Phần thi"
                      name={[field.name, 'part_prompt']}
                    >
                      <Input.TextArea placeholder="Nội dung Phần thi" />
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

                    <Form.Item
                      name={[field.name, 'part_recording']}
                      hidden
                    ></Form.Item>

                    <Form.Item
                      name={[field.name, 'part_image_urls']}
                      hidden
                    ></Form.Item>

                    <div className={styles.buttonsContainer}>
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
                                label="Nội dung Nhóm câu hỏi"
                                name={[
                                  subField.name,
                                  'question_groups_info',
                                  'question_groups_prompt',
                                ]}
                              >
                                <Input.TextArea placeholder="Nội dung Nhóm câu hỏi..." />
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

                              <Form.Item
                                name={[
                                  subField.name,
                                  'question_groups_info',
                                  'question_group_recording',
                                ]}
                                hidden
                              ></Form.Item>

                              <Form.Item
                                name={[
                                  subField.name,
                                  'question_groups_info',
                                  'question_group_image_urls',
                                ]}
                                hidden
                              ></Form.Item>

                              <div className={styles.buttonsContainer}>
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

                                        <Form.Item
                                          name={[
                                            questionField.name,
                                            'question_recording',
                                          ]}
                                          hidden
                                        ></Form.Item>

                                        <Form.Item
                                          name={[
                                            questionField.name,
                                            'question_image_urls',
                                          ]}
                                          hidden
                                        ></Form.Item>

                                        <div
                                          className={styles.buttonsContainer}
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
      <h1 className={styles.title}>Tạo bài thi</h1>

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
        <Button
          onClick={handleOk}
          loading={loading}
        >
          {currentTab === '1' ? 'Tiếp theo' : 'Tạo bài thi'}
        </Button>
      </div>
    </div>
  );
};

export default CreateTest;
