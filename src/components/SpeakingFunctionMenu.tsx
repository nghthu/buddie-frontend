import styles from '@/styles/components/WritingFunctionMenu.module.scss';

interface MenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onMenuItemClick: (message: string) => void;
}

const SpeakingFunctionMenu = ({
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
      <p onClick={() => onMenuItemClick('Đề xuất ý nói')}>Đề xuất ý nói</p>
    </div>
  );
};

export default SpeakingFunctionMenu;
