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
      <p onClick={() => onMenuItemClick('Menu Item 1 text')}>Menu Item 1</p>
      <p onClick={() => onMenuItemClick('Menu Item 2 text')}>Menu Item 2</p>
      <p onClick={() => onMenuItemClick('Menu Item 3 text')}>Menu Item 3</p>
    </div>
  );
};

export default WritingFunctionMenu;
