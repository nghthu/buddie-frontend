'use client';

import { useState, useEffect, useRef } from 'react';
import CountdownClock from '@/components/CountdownClock';
import styles from '@/styles/pages/Writing.module.scss';
import WritingFunctionMenu from '@/components/WritingFunctionMenu';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import BuddieSuport from '@/components/BuddieSupport';

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

  return (
    <>
      <div className={styles.container}>
        <p className={styles.title}>IETLS Writing Task 1</p>

        <div
          className={`${styles.practiceContainer} ${
            chatVisible ? styles.chatVisible : styles.chatHidden
          }`}
          onClick={hideMenu}
        >
          <div className={styles.taskContainer}>
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
              <div className={styles.instruction}>
                <img
                  className={styles.instructionImg}
                  src="/images/logo.png"
                  alt=""
                />
                <p className={styles.textPracticing}>
                  You should spend about 20 minutes on this task
                </p>
              </div>
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
            <div className={styles.practiceButtonContainer}>
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
                <button className={styles.primaryButton}>Xong</button>
              </Link>
            </div>
          </div>

          {chatVisible && (
            <div>
              <BuddieSuport onClose={hideChat} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
