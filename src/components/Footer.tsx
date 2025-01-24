import { PrimeIcons } from "primereact/api";
import FooterItem from "./FooterItem";

const Footer = () => {
  return (
    <div className="absolute bottom-0 flex items-center justify-center w-full pb-3 font-medium gap-28 text-md">
      <FooterItem
        content="Westlake Medical Center"
        icon={PrimeIcons.BUILDING}
      />
      <FooterItem
        content="info@westlakemed.com.ph"
        icon={PrimeIcons.ENVELOPE}
      />
      <FooterItem content="(02) 553-8185" icon={PrimeIcons.PHONE} />
    </div>
  );
};

export default Footer;
