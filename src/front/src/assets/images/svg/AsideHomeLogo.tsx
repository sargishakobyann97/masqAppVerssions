const AsideHomeLogo = ({ fill }: { fill: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" style={{ transform: "scale(0.9)" }}>
        <path
            stroke={fill ? "#560BAD" : "gray"}
            strokeLinecap="round"
            strokeWidth={2.5}
            d="M22 19.543V9.505c0-.651-.315-1.261-.901-1.674-1.54-1.085-4.675-3.242-7.17-5.159-1.112-.855-2.804-.91-3.938-.074L2.998 7.752C2.364 8.22 2 8.9 2 9.618v9.925C2 20.9 3.28 22 4.857 22h.714c1.578 0 2.858-1.1 2.858-2.457v-2.457c0-1.356 1.279-2.456 2.857-2.456h1.428c1.578 0 2.857 1.1 2.857 2.456v2.457c0 1.357 1.28 2.457 2.858 2.457h.714C20.72 22 22 20.9 22 19.543Z"
        />
    </svg>
);
export default AsideHomeLogo;
