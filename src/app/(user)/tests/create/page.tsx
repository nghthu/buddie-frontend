'use client';

import styles from '@/styles/pages/tests/create/Create.module.scss';
import {
  Button,
  Card,
  Checkbox,
  InputNumber,
  Radio,
  Space,
  Tabs,
  Typography,
} from 'antd';
import { useState } from 'react';
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
import { auth } from '@/lib';

const { TabPane } = Tabs;
const { Option } = Select;

const Exams = () => {
  const [currentTab, setCurrentTab] = useState('1');
  const [form] = Form.useForm();
  const [haveOptions, setHaveOptions] = useState(false);
  const [haveChoices, setHaveChoices] = useState(false);

  const handleOk = async () => {
    if (currentTab === '1') {
      try {
        await form.validateFields();
        const values = form.getFieldsValue();
        form.setFieldsValue({ tags: values.tags.split(' ') });
        setCurrentTab('2');
      } catch (error) {
        // Handle form validation error
      }
    } else {
      // Handle the OK action for tab 2
    }
  };

  const handleCancel = () => {
    if (currentTab === '2') {
      setCurrentTab('1');
    } else {
      // Handle the Cancel action for tab 1
    }
  };

  const handleTabChange = (key: string) => {
    setCurrentTab(key);
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
            name="tags"
            label="Tags"
          >
            <Input />
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
                part_recording: null,
                part_prompt: '',
                part_image_urls: null,
                question_groups: [
                  {
                    is_single_question: true,
                    question_groups_info: {
                      question_groups_duration: null,
                      question_groups_prompt: '',
                      question_groups_recording: null,
                      question_groups_image_urls: null,
                    },
                    questions: [
                      {
                        question_number: 1,
                        question_type: '',
                        question_prompt: '',
                        question_image_urls: null,
                        question_duration: null,
                        question_preparation_time: null,
                        question_recording: null,
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
                    title={`Part ${index + 1}`}
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
                      label="Part Prompt"
                      name={[field.name, 'part_prompt']}
                    >
                      <Input.TextArea placeholder="Part Prompt" />
                    </Form.Item>

                    <div className={styles.buttonsContainer}>
                      <Form.Item name={[field.name, 'part_recording']}>
                        <Button icon={<SoundOutlined />}></Button>
                      </Form.Item>
                      <Form.Item name={[field.name, 'part_image_urls']}>
                        <Button icon={<PictureOutlined />}></Button>
                      </Form.Item>
                    </div>

                    <Form.Item
                      label="Part Duration"
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
                              title={`Question Group ${subField.name + 1}`}
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
                                label="Question Group Prompt"
                                name={[
                                  subField.name,
                                  'question_groups_info',
                                  'question_groups_prompt',
                                ]}
                              >
                                <Input.TextArea placeholder="Question Group Prompt" />
                              </Form.Item>
                              <div className={styles.buttonsContainer}>
                                <Form.Item
                                  name={[field.name, 'part_recording']}
                                >
                                  <Button icon={<SoundOutlined />}></Button>
                                </Form.Item>
                                <Form.Item
                                  name={[field.name, 'part_image_urls']}
                                >
                                  <Button icon={<PictureOutlined />}></Button>
                                </Form.Item>
                              </div>

                              <Form.Item
                                label="Question Group Duration"
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
                                        title={`Question ${
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
                                                  ]) as Array<any>;
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
                                          label="Question Prompt"
                                          name={[
                                            questionField.name,
                                            'question_prompt',
                                          ]}
                                        >
                                          <Input.TextArea placeholder="Question Prompt" />
                                        </Form.Item>
                                        <div
                                          className={styles.buttonsContainer}
                                        >
                                          <Form.Item
                                            name={[
                                              field.name,
                                              'part_recording',
                                            ]}
                                          >
                                            <Button
                                              icon={<SoundOutlined />}
                                            ></Button>
                                          </Form.Item>
                                          <Form.Item
                                            name={[
                                              field.name,
                                              'part_image_urls',
                                            ]}
                                          >
                                            <Button
                                              icon={<PictureOutlined />}
                                            ></Button>
                                          </Form.Item>
                                        </div>

                                        <Form.Item
                                          label="Question Type"
                                          name={[
                                            questionField.name,
                                            'question_type',
                                          ]}
                                        >
                                          <Select
                                            onChange={(value) => {
                                              if (
                                                value === 'selection' ||
                                                value === 'single_choice' ||
                                                value === 'multiple_choices'
                                              ) {
                                                setHaveOptions(true);
                                                if (
                                                  value === 'multiple_choices'
                                                ) {
                                                  setHaveChoices(true);
                                                } else {
                                                  setHaveChoices(false);
                                                }
                                              } else {
                                                setHaveOptions(false);
                                              }
                                            }}
                                          >
                                            <Option value="selection">
                                              Selection
                                            </Option>
                                            <Option value="single_choice">
                                              Single Choice
                                            </Option>
                                            <Option value="multiple_choices">
                                              Multiple Choice
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
                                            label="Preparation"
                                            name={[
                                              questionField.name,
                                              'question_preparation_time',
                                            ]}
                                          >
                                            <InputNumber min={1} />
                                          </Form.Item>

                                          <Form.Item
                                            label="Duration"
                                            name={[
                                              questionField.name,
                                              'question_duration',
                                            ]}
                                          >
                                            <InputNumber min={1} />
                                          </Form.Item>
                                        </div>

                                        {haveOptions && haveChoices && (
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
                                                            const questionType =
                                                              form.getFieldValue(
                                                                [
                                                                  'parts',
                                                                  field.name,
                                                                  'question_groups',
                                                                  subField.name,
                                                                  'questions',
                                                                  questionField.name,
                                                                  'question_type',
                                                                ]
                                                              );
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
                                                                  (a: string) =>
                                                                    a !==
                                                                    String(
                                                                      index + 1
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
                                                              "Please input option's text or delete this field.",
                                                          },
                                                        ]}
                                                        noStyle
                                                      >
                                                        <Input placeholder="Option text" />
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
                                                    Add option
                                                  </Button>
                                                </Form.Item>
                                              </div>
                                            )}
                                          </Form.List>
                                        )}

                                        {haveOptions && !haveChoices && (
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
                                                      (optionField, index) => (
                                                        <Space
                                                          key={optionField.key}
                                                          align="baseline"
                                                        >
                                                          <Form.Item>
                                                            <Radio
                                                              value={index + 1}
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
                                                                required: true,
                                                                whitespace:
                                                                  true,
                                                                message:
                                                                  "Please input option's text or delete this field.",
                                                              },
                                                            ]}
                                                            noStyle
                                                          >
                                                            <Input placeholder="Option text" />
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
                                                    Add option
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
                                            ]) as Array<any>;
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
                                      Add Question
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
                            Add Question Group
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
                      ) as Array<any>;
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
                  Add Part
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item
            noStyle
            shouldUpdate
          >
            {() => (
              <Typography>
                <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
              </Typography>
            )}
          </Form.Item>
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
        <Button onClick={handleOk}>
          {currentTab === '1' ? 'Tiếp theo' : 'Tạo bài thi'}
        </Button>
      </div>
    </div>
  );
};

export default Exams;
