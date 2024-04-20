'use client';
import { ClockCircleOutlined } from '@ant-design/icons';
import styles from '@/styles/components/TestCard.module.scss';
import { Button, Modal, Select } from 'antd';
import { useState } from 'react';

import Link from 'next/link';

export default function TestCard(props: { testName: string, testDuration: string, testTags: string[], testparts: number, testSkill: string, testId: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleClick = () => {
        showModal();
    }
    const handleSelectChange = (value: string) => {
        console.log(value);
    }

    const skill = props.testSkill.split('_')[1];
    const duration = Number(props.testDuration) / 60;

    const partSelectButtons = (
        <div className={styles.partSelect}>
            {Array.from({ length: props.testparts }, (_, i) => i + 1).map((part) => {
                return <Link href={`${skill}/${props.testId}/${part}`} key={part}><Button key={part} type="primary">Part {part}</Button></Link>
            })}

        </div>
    );
    return (
        <div className={styles.cardWrapper}>
            <h3>{props.testName}</h3>
            <div className={styles.clock}><ClockCircleOutlined />{duration} phút</div>
            <div className={styles.testTagWrapper}>
                {props.testTags.map((tag) => {
                    return <span className={styles.testTag} key={tag}>{tag}</span>
                })}
            </div>
            <Button onClick={handleClick} className={styles.button}>Chi tiết</Button>
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <div className={styles.modal}>
                    <h3>{props.testName}</h3>
                    <div className={styles.testTagWrapperModal}>
                        {props.testTags.map((tag) => {
                            return <span className={styles.testTag} key={tag}>{tag}</span>
                        })}
                    </div>
                    <div className={styles.modalSelect}>
                        Chọn thời gian
                        <Select defaultValue="không giới hạn" options={[{ value: "unlimied", label: "không giới hạn" }, { value: "dependent", label: "theo thời gian của đề" }]} style={{ width: '200px' }} onChange={handleSelectChange} />
                    </div>
                    {partSelectButtons}
                    <Link href={`${skill}/${props.testId}/all`}>
                        <Button type="primary" className={styles.purpleBtn}>Luyện tập tất cả</Button>
                    </Link>
                </div>
            </Modal>
        </div>
    )
}