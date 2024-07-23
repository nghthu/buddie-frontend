import styles from '@/styles/components/AdminDashboard.module.scss';
import { Space, Spin, Table, Tag, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { auth } from '@/lib';

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

const columns: TableProps<DataTable>['columns'] = [
  {
    title: 'Mã đề thi',
    dataIndex: 'key',
    key: 'key',
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
  },
  {
    title: 'Người tạo',
    dataIndex: 'owner',
    key: 'owner',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdDate',
    key: 'createdDate',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
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
    render: () => (
      // render: (_, record) => (
      <Space size="middle">
        {/* <a>Invite {record.name}</a> */}
        <a>Chỉnh sửa</a>
        <a className={styles.delete}>Delete</a>
      </Space>
    ),
  },
];

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

const LIMIT = 8;

const AdminDashboard = () => {
  const [totalPage] = useState(1);
  const [searchValue] = useState('');
  const [tableData, setTableData] = useState<DataTable[] | undefined>(
    undefined
  );
  const user = auth.currentUser;

  const { data, isLoading } = useSWR(
    {
      url: `/api/tests?page=${totalPage}&search=${searchValue}&limit=${LIMIT}&isbuddie=false`,
      user,
    },
    fetcher
  );

  useEffect(() => {
    if (data) {
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

  if (isLoading) return <Spin size="large" />;

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      className={styles['admin-dashboard']}
    />
  );
};

export default AdminDashboard;
