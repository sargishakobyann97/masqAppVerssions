const CrownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={9} height={10} fill="none">
        <mask
            id="b"
            width={9}
            height={10}
            x={0}
            y={0}
            maskUnits="userSpaceOnUse"
            style={{
                maskType: "alpha",
            }}
        >
            <path fill="url(#a)" d="M0 0h9v10H0z" />
        </mask>
        <g mask="url(#b)">
            <path fill="#560BAD" d="M-.643 0h10.929v10H-.643z" />
        </g>
        <defs>
            <pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
                <use xlinkHref="#c" transform="matrix(.0039 0 0 .00352 0 .05)" />
            </pattern>
            <image
                xlinkHref="data:image/png;base64,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"
                id="c"
                width={256}
                height={256}
            />
        </defs>
    </svg>
);
export default CrownIcon;
