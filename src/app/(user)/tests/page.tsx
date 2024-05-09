'use client';

import styles from '@/styles/pages/exams/Tests.module.scss';
import { Button, Card, Modal, Tabs, Typography } from 'antd';
import { useState, useEffect } from 'react';
import {
  FormOutlined,
  OrderedListOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Form, Input, Select, AutoComplete } from 'antd';

const { TabPane } = Tabs;
const { Option } = Select;

const Exams = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

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
      setIsModalVisible(false);
    }
  };

  const handleTabChange = (key: string) => {
    setCurrentTab(key);
  };

  return (
    <div>
      <h1>Đề thi IELTS</h1>
      <Button onClick={showModal}>Tạo bài thi</Button>
      <Modal
        title={<h2 className={styles.modalTitle}>Tạo bài thi</h2>}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={currentTab === '2' ? '80%' : '50%'}
        okText={currentTab === '1' ? 'Tiếp theo' : 'Tạo bài thi'}
        cancelText={currentTab === '1' ? 'Hủy' : 'Quay lại'}
      >
        <Tabs
          activeKey={currentTab}
          onChange={handleTabChange}
          type="card"
        >
          <TabPane
            tab="1. Thông tin"
            key="1"
            icon={<FormOutlined />}
          >
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item
                name="test_name"
                label="Tên bài thi"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên bài thi!' },
                ]}
              >
                <Input placeholder="Tên bài thi..." />
              </Form.Item>

              <Form.Item
                name="access"
                label="Truy cập"
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
                rules={[
                  { required: true, message: 'Vui lòng nhập thời gian!' },
                ]}
              >
                <Select>
                  <Option value="30">30</Option>
                  <Option value="60">60</Option>
                  <Option value="90">90</Option>
                  <Option value="120">120</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="tags"
                label="Tags"
              >
                <Input />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane
            tab="2. Câu hỏi"
            key="2"
            icon={<OrderedListOutlined />}
            disabled={currentTab === '1'}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                parts: [
                  {
                    part_prompt: '',
                    question_groups: [
                      {
                        question_groups_info: {
                          question_groups_prompt: '',
                        },
                        questions: [
                          {
                            question_prompt: '',
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
                    {fields.map((field) => (
                      <Card
                        size="small"
                        title={`Part ${field.name + 1}`}
                        key={field.key}
                        extra={
                          <CloseOutlined
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        }
                      >
                        <Form.Item
                          label="Part Prompt"
                          name={[field.name, 'part_prompt']}
                        >
                          <Input placeholder="Part Prompt" />
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
                                    label="Question Group Prompt"
                                    name={[
                                      subField.name,
                                      'question_groups_info',
                                      'question_groups_prompt',
                                    ]}
                                  >
                                    <Input placeholder="Question Group Prompt" />
                                  </Form.Item>

                                  <Form.List
                                    name={[subField.name, 'questions']}
                                  >
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
                                                }}
                                              />
                                            }
                                          >
                                            <Form.Item
                                              label="Question Prompt"
                                              name={[
                                                questionField.name,
                                                'question_prompt',
                                              ]}
                                            >
                                              <Input placeholder="Question Prompt" />
                                            </Form.Item>
                                          </Card>
                                        ))}
                                        <Button
                                          type="dashed"
                                          onClick={() => questionOpt.add()}
                                          block
                                        >
                                          + Add Question
                                        </Button>
                                      </div>
                                    )}
                                  </Form.List>
                                </Card>
                              ))}
                              <Button
                                type="dashed"
                                onClick={() => subOpt.add()}
                                block
                              >
                                + Add Question Group
                              </Button>
                            </div>
                          )}
                        </Form.List>
                      </Card>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                    >
                      + Add Part
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
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default Exams;
