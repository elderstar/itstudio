import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
            <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
            <circle cx="20" cy="20" r="4.5" fill="currentColor" />
            <circle cx="28" cy="12" r="2" fill="currentColor" />
            <circle cx="11" cy="26" r="1.5" fill="currentColor" opacity="0.8" />
        </svg>
    );
}
