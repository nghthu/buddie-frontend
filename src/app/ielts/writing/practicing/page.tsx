'use client';

import { useState, useEffect, useRef } from 'react';
import CountdownClock from '@/components/CountdownClock';
import styles from '@/styles/pages/Writing.module.scss';
import WritingFunctionMenu from '@/components/WritingFunctionMenu';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PracticePage() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const searchParams = useSearchParams();
  const part = searchParams.get('part');

  const showMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    let selection = '';
    if ((event.target as Element).tagName === 'TEXTAREA') {
      selection =
        textareaRef.current?.value.substring(
          textareaRef.current?.selectionStart || 0,
          textareaRef.current?.selectionEnd || 0
        ) || '';
    }
    if (selection || (event.target as Element).tagName === 'IMG') {
      setMenuVisible(true);
      setMenuPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const hideMenu = () => {
    setMenuVisible(false);
  };

  const showChat = (message: string) => {
    setSelectedMenuItem(message);
    setChatVisible(true);
  };

  const hideChat = () => {
    setChatVisible(false);
  };

  console.log(part, typeof part);
  return (
    <>
      <div className={styles.container}>
        <p className={styles.title}>IETLS Writing Task 1</p>

        <div
          className={styles.mainContainer}
          onClick={hideMenu}
          style={{
            flexDirection: 'row',
            gap: '30px',
            overflow: chatVisible ? 'auto' : 'visible',
            height: chatVisible ? '100vh' : 'fit-content',
          }}
        >
          <div
            className={styles.practiceContainer}
            style={{ overflowY: chatVisible ? 'auto' : 'visible' }}
          >
            <div className={styles.task}>
              The graph below shows the number of tourists visiting a particular
              Caribbean island between 2010 and 2017. Summarize the information
              by selecting and reporting the main features, and make comparisons
              where relevant. <br />
              <br />
              Write at least 150 words.
            </div>

            {part !== '2' && (
              <div
                className={styles.imgContainer}
                onContextMenu={showMenu}
              >
                <img
                  src="https://vcdn-vnexpress.vnecdn.net/2021/09/28/hoc-1-8243-1632817857.png"
                  alt="IELTS Writing Task 1"
                />
                <WritingFunctionMenu
                  visible={menuVisible}
                  position={menuPosition}
                  onMenuItemClick={showChat}
                />
              </div>
            )}
            <div className={styles.answerHeader}>
              <p className={styles.textPracticing}>
                You should spend about 20 minutes on this task
              </p>
              <CountdownClock />
            </div>
            <div className={styles.answerContainer}>
              <p className={styles.textPracticing}>Trả lời:</p>
              <textarea
                ref={textareaRef}
                className={styles.answerInput}
                onContextMenu={showMenu}
              />
              <WritingFunctionMenu
                visible={menuVisible}
                position={menuPosition}
                onMenuItemClick={showChat}
              />
            </div>
            <div
              className={styles.buttonContainer}
              style={{ justifyContent: 'space-between' }}
            >
              <Link href="/ielts/writing">
                <button className={styles.redButton}>Thoát</button>
              </Link>

              <Link
                href={
                  part === 'all'
                    ? '/ielts/writing/practicing?part=2'
                    : '/ielts/writing/result'
                }
              >
                <button
                  className={styles.primaryButton}
                  style={{ width: '295px' }}
                >
                  Xong
                </button>
              </Link>
            </div>
          </div>

          <div
            className={
              chatVisible
                ? styles.chatContainerVisible
                : styles.chatContainerHidden
            }
          >
            <div>
              <div className={styles.chatUser}>
                <img
                  src="/images/avatar.jpg"
                  alt=""
                  className={styles.userAvatar}
                />
                <p className={styles.username}>Bạn</p>
              </div>
              <p className={styles.chatMessage}>{selectedMenuItem}</p>
            </div>

            <div>
              <div className={styles.chatUser}>
                <img
                  src="/images/logo.png"
                  alt=""
                  className={styles.userAvatar}
                />
                <p className={styles.username}>Buddie</p>
              </div>
              <p className={styles.chatMessage}>
                The graph illustrates the fluctuating number of tourists
                visiting a Caribbean island from 2010 to 2017, with an overall
                upward trend, peaking in 2015 possibly due to factors such as
                marketing campaigns or infrastructure improvements.
              </p>
            </div>
            <button
              className={styles.closeButton}
              onClick={hideChat}
              style={{ cursor: 'pointer' }}
            >
              X
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
