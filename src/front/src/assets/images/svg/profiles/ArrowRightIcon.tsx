const ArrowRightIcon = ({ fill }: { fill: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} fill="none">
        <path stroke={fill ? "#282828" : "gray"} strokeLinecap="round" strokeLinejoin="round" d="M3.75 1.875 6.875 5 3.75 8.125" />
    </svg>
);
export default ArrowRightIcon;
