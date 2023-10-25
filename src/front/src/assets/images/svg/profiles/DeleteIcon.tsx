const DeleteIcon = ({ fill }: { fill: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
        <path
            stroke={fill ? "#282828" : "gray"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.3}
            d="M13.5 3.5h-11M5.5 1.5h5M12.5 3.5V13a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V3.5"
        />
    </svg>
);
export default DeleteIcon;
