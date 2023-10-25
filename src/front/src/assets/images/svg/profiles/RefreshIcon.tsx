const RefreshIcon = ({ fill }: { fill: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
        <path stroke={fill ? "#282828" : "gray"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M11.01 6.232h3v-3" />
        <path
            stroke={fill ? "#282828" : "gray"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M4.111 4.11a5.5 5.5 0 0 1 7.779 0l2.12 2.122M4.99 9.768h-3v3"
        />
        <path
            stroke={fill ? "#282828" : "gray"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M11.889 11.889a5.501 5.501 0 0 1-7.778 0L1.989 9.768"
        />
    </svg>
);
export default RefreshIcon;
