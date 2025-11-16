import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Lovedit logo"
        >
            <defs>
                <clipPath id="rounded-rect">
                    <rect x="0" y="0" width="40" height="40" rx="8" ry="8" />
                </clipPath>
            </defs>
            <g clipPath="url(#rounded-rect)">
                <image
                    href="/logo.png"
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid meet"
                />
            </g>
        </svg>
    );
}
