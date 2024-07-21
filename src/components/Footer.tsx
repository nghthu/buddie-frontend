import styles from '@/styles/components/Footer.module.scss';
// import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.logo}>
          {/* <Image
            height={60}
            width={60}
            src="/images/logo/main.svg"
            alt="Buddie logo"
          /> */}
          <div>
            <h3>buddie</h3>
            <p>Học tiếng anh cùng AI</p>
          </div>
          <div>
            <p>Trường Đại học Khoa học Tự nhiên</p>
            <p>Khoa Công nghệ Thông tin</p>
            <p>227 Nguyễn Văn Cừ, Quận 5, Hồ Chí Minh</p>
          </div>
        </div>
        <div className={styles.team}>
          <h3>Thành viên</h3>
          <p>Văn Lý Hải</p>
          <p>Dư Thanh Huy</p>
          <p>La Thành Triết</p>
          <p>Nguyễn Hạnh Thư</p>
          <p>Nguyễn Ngọc Thùy</p>
        </div>
        <div className={styles.contact}>
          <h3>Liên hệ với chúng tôi</h3>
          <Link
            className={styles.email}
            href="mailto:support@buddie.com"
          >
            Email: support@buddie.com
          </Link>
          <p>Điện thoại: 0123456789</p>
        </div>
      </div>
      <p className={styles.copyright}>
        Copyright &copy; 2024. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
