const TopUpWalletIcon = ({ fill }: { fill: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={11} height={11} fill="none">
        <path stroke={fill ? "#fff" : "#292929"} strokeMiterlimit={10} d="M5.5 9.625a4.125 4.125 0 1 0 0-8.25 4.125 4.125 0 0 0 0 8.25Z" />
        <path stroke={fill ? "#fff" : "#292929"} strokeLinecap="round" strokeLinejoin="round" d="M3.781 5.5H7.22M5.5 3.781V7.22" />
    </svg>
);
export default TopUpWalletIcon;
