const ExportProfilesIcon = ({ fill }: { fill: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
        <path
            stroke={fill ? "#282828" : "gray"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.3}
            d="M13.5 6.25V2.5H9.75M8.998 7.002l4.5-4.5M11.5 9v4a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5h4"
        />
    </svg>
);
export default ExportProfilesIcon;
