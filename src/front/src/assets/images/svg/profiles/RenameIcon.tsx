const RenameIcon = ({ fill }: { fill: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
        <path
            stroke={fill ? "#292929" : "gray"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.1}
            d="M6 13.5H3a.5.5 0 0 1-.5-.5v-2.793a.5.5 0 0 1 .146-.354l7.5-7.5a.5.5 0 0 1 .708 0l2.792 2.793a.5.5 0 0 1 0 .707L6 13.5ZM8.5 4 12 7.5"
        />
        <path stroke={fill ? "#292929" : "gray"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.1} d="M13.5 13.5H6L2.53 10.03" />
    </svg>
);
export default RenameIcon;
