const LogOutProfileIcon = ({ fill }: { fill: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} fill="none">
        <path
            stroke={fill ? "#fff" : "#292929"}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.797 3.36 8.437 5l-1.64 1.64M4.063 5h4.373M4.063 8.438H1.874a.312.312 0 0 1-.313-.313v-6.25a.312.312 0 0 1 .313-.313h2.188"
        />
    </svg>
);
export default LogOutProfileIcon;
