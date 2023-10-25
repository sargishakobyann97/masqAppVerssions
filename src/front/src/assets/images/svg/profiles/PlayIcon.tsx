import { MouseEventHandler } from "react";

const PlayIcon = ({ onClick = () => {} }: { onClick?: MouseEventHandler<SVGSVGElement> }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} fill="none" onClick={onClick}>
        <path
            fill="#fff"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.912 4.733 3.288 1.296a.313.313 0 0 0-.475.267v6.874a.313.313 0 0 0 .475.267l5.624-3.437a.313.313 0 0 0 0-.534Z"
        />
    </svg>
);
export default PlayIcon;
