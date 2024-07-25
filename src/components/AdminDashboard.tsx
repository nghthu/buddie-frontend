import styles from '@/styles/components/AdminDashboard.module.scss';
import { Button, Space, Table, Tag, Tooltip } from 'antd';
import { TableProps, notification } from 'antd';
import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { auth } from '@/lib';
import Link from 'next/link';
import type { NotificationArgsProps } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import { Input } from 'antd';
import { useRouter } from 'next/navigation';

const { Search } = Input;

interface Review {
  star: number;
  count: number;
}

interface Question {
  question_number: number;
  question_type: string;
  question_prompt: string;
  question_image_urls: string[];
  question_duration: number | null;
  answer: string;
  options: string[];
  _id: string;
}

interface QuestionGroup {
  question_groups_info: {
    question_groups_duration: number | null;
    question_groups_prompt: string;
    question_groups_recording: string | null;
    question_groups_image_urls: string[];
  };
  is_single_question: boolean;
  questions: Question[];
  _id: string;
}

interface TestPart {
  part_number: number;
  part_duration: number | null;
  part_recording: string | null;
  part_prompt: string;
  part_image_urls: string[];
  question_groups: QuestionGroup[];
  _id: string;
}

interface UserInfo {
  user_id: string;
  display_name: string;
  photo_url: string;
}

interface Test {
  review: Review;
  _id: string;
  test_name: string;
  test_type: string;
  user_id: string;
  duration: number;
  access: string;
  is_buddie_test: boolean;
  tags: string[];
  submission_count: number;
  comment_count: number;
  is_deleted: boolean;
  parts: TestPart[];
  created_at: string;
  updated_at: string;
  deleted_at: string;
  user: UserInfo;
}

interface DataTable {
  key: string;
  name: string;
  owner: number;
  createdDate: string;
  tags: string[];
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

type NotificationPlacement = NotificationArgsProps['placement'];
const Context = React.createContext({ status: 'Success' });

const LIMIT = 50;
const OFFSET = 0;

const AdminDashboard = ({ buddie = false }: { buddie?: boolean }) => {
  const [totalPage] = useState(1);
  const [tableData, setTableData] = useState<DataTable[] | undefined>(
    undefined
  );
  const [api, contextHolder] = notification.useNotification();
  const [columns, setColumns] =
    useState<TableProps<DataTable>['columns']>(undefined);
  const [contextValue, setContextValue] = useState({ status: '' });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const user = auth.currentUser;
  const router = useRouter();

  const {
    data,
    isLoading,
    mutate: mutateTests,
    isValidating,
  } = useSWR(
    {
      url: `/api/tests?page=${totalPage}&search=${searchValue}&offset=${OFFSET}&limit=${LIMIT}&isbuddie=${buddie}&`,
      user,
    },
    fetcher
  );

  useEffect(() => {
    if (data) {
      setColumns([
        {
          title: 'Mã đề thi',
          dataIndex: 'key',
          key: 'key',
          width: '15%',
          render: (text) => (
            <Tooltip title="Xem chi tiết">
              <a className={styles.green}>{text}</a>
            </Tooltip>
          ),
        },
        {
          title: 'Tên đề thi',
          dataIndex: 'name',
          key: 'name',
          width: '25%',
        },
        {
          title: 'Người tạo',
          dataIndex: 'owner',
          key: 'owner',
          width: '15%',
        },
        {
          title: 'Ngày tạo',
          dataIndex: 'createdDate',
          key: 'createdDate',
          width: '15%',
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          width: '15%',
          render: (_, { tags }) => (
            <>
              {tags.map((tag) => {
                let color = 'green';
                if (tag.toLowerCase().includes('ielts')) {
                  color = 'geekblue';
                }
                return (
                  <Tag
                    color={color}
                    key={tag}
                  >
                    {tag}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: 'Hành động',
          key: 'action',
          width: '15%',
          render: (_, record) => (
            <Space size="middle">
              <Link href={`/tests/update/${record.key}`}>Cập nhật</Link>
              <Button
                type="link"
                danger
                onClick={() => deleteTestHandler(record.key)}
                className={styles.delete}
              >
                Xóa
              </Button>
            </Space>
          ),
        },
      ]);

      const tableFormattedData: DataTable[] = data.tests.map((test: Test) => {
        const date = new Date(test.created_at);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear().toString();

        const formattedDate = `${day}/${month}/${year}`;

        return {
          key: test._id,
          name: test.test_name,
          owner: test.user.display_name,
          createdDate: formattedDate,
          tags: test.tags,
        };
      });

      setTableData(tableFormattedData);
    }
  }, [data]);

  const openNotification = (placement: NotificationPlacement, type: string) => {
    console.log(type);
    if (type === 'success')
      return api.success({
        message: (
          <Context.Consumer>{({ status }) => `${status}!`}</Context.Consumer>
        ),
        placement,
      });
    return api.error({
      message: (
        <Context.Consumer>{({ status }) => `${status}!`}</Context.Consumer>
      ),
      placement,
    });
  };

  const deleteTestHandler = async (testId: string) => {
    const user = auth.currentUser;
    const token = await user?.getIdToken();

    setLoading(true);
    const response = await fetch(`/api/tests/${testId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    mutateTests();
    console.log(result);
    if (result.status === 'success') {
      setContextValue({ status: `Xóa thành công` });
    } else {
      setContextValue({ status: `Đã có lỗi xảy ra, xin hãy thử lại sau` });
    }
    openNotification('topRight', result.status);
    setLoading(false);
  };

  const onSearch: SearchProps['onSearch'] = (value) => {
    const searchWords = encodeURIComponent(value.trim());
    setSearchValue(searchWords);
  };

  const createTest = () => {
    router.push('/ielts/create');
  };

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <>
        <div className={styles.control}>
          <Search
            placeholder="Nhập từ khóa cần tìm"
            onSearch={onSearch}
            style={{ width: 300 }}
          />
          {buddie && (
            <button
              className={styles['create-question-btn']}
              onClick={createTest}
            >
              Tạo đề thi
            </button>
          )}
        </div>
        <Table
          columns={columns}
          dataSource={tableData}
          className={styles['admin-dashboard']}
          loading={isLoading || loading || isValidating}
          locale={{ emptyText: isLoading ? ' ' : 'Không có dữ liệu' }}
        />
      </>
    </Context.Provider>
  );
};

export default AdminDashboard;
