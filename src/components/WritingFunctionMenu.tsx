import styles from '@/styles/components/WritingFunctionMenu.module.scss';

interface MenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onMenuItemClick: (message: string) => void;
}

const WritingFunctionMenu: React.FC<MenuProps> = ({
  visible,
  position,
  onMenuItemClick,
}) => {
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
    </div>
  );
};

export default WritingFunctionMenu;
