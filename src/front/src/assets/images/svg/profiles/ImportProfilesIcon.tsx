const ImportProfilesIcon = ({ fill }: { fill: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
        <path
            stroke={fill ? "#282828" : "gray"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.3}
            d="M9 3.25V7h3.75M13.503 2.498l-4.5 4.5"
        />
        <path
            stroke={fill ? "#282828" : "gray"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.3}
            d="M6 4H3a.5.5 0 0 0-.5.5V13a.5.5 0 0 0 .5.5h8.5a.5.5 0 0 0 .5-.5v-3"
        />
    </svg>
);
export default ImportProfilesIcon;
