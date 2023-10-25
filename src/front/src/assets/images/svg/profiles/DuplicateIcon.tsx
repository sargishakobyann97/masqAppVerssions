const DuplicateIcon = ({ fill }: { fill: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
        <path stroke={fill ? "#282828" : "gray"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3} d="M10.5 10.5h3v-8h-8v3" />
        <path stroke={fill ? "#282828" : "gray"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3} d="M10.5 5.5h-8v8h8v-8Z" />
    </svg>
);
export default DuplicateIcon;
