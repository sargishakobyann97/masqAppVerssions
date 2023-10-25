const SwitchLockerLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={9} height={12} fill="none">
        <mask
            id="a"
            width={9}
            height={12}
            x={0}
            y={0}
            maskUnits="userSpaceOnUse"
            style={{
                maskType: "alpha",
            }}
        >
            <path
                fill="#000"
                d="M4.5 0c-1.65 0-3 1.543-3 3.429v1.714H0V12h9V5.143H7.5V3.429C7.5 1.543 6.15 0 4.5 0Zm0 1.714c.84 0 1.5.755 1.5 1.715v1.714H3V3.429c0-.96.66-1.715 1.5-1.715Z"
            />
        </mask>
        <g mask="url(#a)">
            <path fill="#560BAD" d="M0 0h9v12H0z" />
        </g>
    </svg>
);
export default SwitchLockerLogo;
