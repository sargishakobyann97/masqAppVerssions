const ShareIcon = ({ fill, width, height }: { fill: boolean; width?: string; height?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
        <path stroke={fill ? "#282828" : "gray"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m11 9.5 3-3-3-3" />
        <path stroke={fill ? "#282828" : "gray"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 12.5a6 6 0 0 1 6-6h6" />
    </svg>
);
export default ShareIcon;
