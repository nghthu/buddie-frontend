import styles from '@/styles/components/WritingFunctionMenu.module.scss';

interface MenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onMenuItemClick: (message: string) => void;
}

const ReadingFunctionMenu: React.FC<MenuProps> = ({
  visible,
  position,
  onMenuItemClick,
}: MenuProps) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={styles.menu}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
      }}
    >
      <p onClick={() => onMenuItemClick('Dịch')}>Dịch</p>
      <p onClick={() => onMenuItemClick('Viết lại')}>Viết lại</p>
      <p onClick={() => onMenuItemClick('Từ đồng nghĩa')}>Từ đồng nghĩa</p>
      <p onClick={() => onMenuItemClick('Tạo tiêu đề')}>Tạo tiêu đề</p>
    </div>
  );
};

export default ReadingFunctionMenu;
