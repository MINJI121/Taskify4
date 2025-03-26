import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[var(--color-black)] text-[var(--color-gray3)] px-4 py-[40px] flex flex-col items-center gap-[32px] sm:gap-[40px] md:flex-row md:justify-between md:px-[70px]">
      {/* 왼쪽 - 저작권 */}
      <div className="text-[13px] font-13m">©codeit - 2025</div>

      {/* 가운데 - 링크 */}
      <div className="flex gap-[32px] text-[13px] font-13m">
        <span className="cursor-pointer hover:underline">Privacy Policy</span>
        <span className="cursor-pointer hover:underline">FAQ</span>
      </div>

      {/* 오른쪽 - SNS 아이콘 */}
      <div className="flex items-center gap-[20px]">
        <Link href="https://mail.google.com/" aria-label="email">
          <Image src="/svgs/email.svg" width={20} height={20} alt="이메일" />
        </Link>
        <Link href="https://facebook.com/" aria-label="facebook">
          <Image
            src="/svgs/facebook.svg"
            width={20}
            height={20}
            alt="페이스북"
          />
        </Link>
        <Link href="https://instagram.com/" aria-label="instagram">
          <Image
            src="/svgs/instagram.svg"
            width={20}
            height={20}
            alt="인스타그램"
          />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
