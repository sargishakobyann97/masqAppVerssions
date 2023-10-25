const MoveToFolderIcon = ({ fill }: { fill: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
        <path
            stroke={fill ? "#282828" : "gray"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.3}
            d="M15.75 6.188v7.937a.5.5 0 0 1-.5.5H2.812a.563.563 0 0 1-.562-.563V4.5a.563.563 0 0 1 .563-.563h3.75c.121 0 .24.04.337.113l1.95 1.463a.562.562 0 0 0 .338.112h6a.562.562 0 0 1 .562.563ZM7.313 10.125h3.375M9 8.438v3.374"
        />
    </svg>
);
export default MoveToFolderIcon;
