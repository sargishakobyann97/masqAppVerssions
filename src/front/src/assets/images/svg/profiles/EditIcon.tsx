const EditIcon = ({ fill }: { fill: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
        <path
            stroke={fill ? "#282828" : "gray"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.3}
            d="M6.5 13.293h-3a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .146-.354l7.5-7.5a.5.5 0 0 1 .708 0l2.792 2.793a.5.5 0 0 1 0 .707L6.5 13.293Z"
        />
        <path stroke={fill ? "#282828" : "gray"} strokeLinecap="round" strokeLinejoin="round" d="M8.5 4 12 7.5" />
    </svg>
);
export default EditIcon;
