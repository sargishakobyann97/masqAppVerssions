import { MouseEventHandler } from "react";

const StopIcon = ({ onClick = () => {} }: { onClick?: MouseEventHandler<SVGSVGElement> }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={8} height={8} fill="none" onClick={onClick}>
        <path fill="#fff" d="M8 0H0v8h8V0Z" />
        <path
            fill="#fff"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m7.13 3.787-4.5-2.75a.25.25 0 0 0-.38.213v5.5a.25.25 0 0 0 .38.213l4.5-2.75a.25.25 0 0 0 0-.426Z"
        />
    </svg>
);
export default StopIcon;
