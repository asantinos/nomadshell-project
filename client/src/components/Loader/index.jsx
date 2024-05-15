import React from "react";
import styled from "styled-components";

const Loader = () => {
    // LOADER STYLES
    const Loader = styled.div`
        display: inline-grid;
        padding: 5px;
        background: #fff;
        filter: blur(4px) contrast(12);
        &:before,
        &:after {
            content: "";
            grid-area: 1/1;
            height: 40px;
            aspect-ratio: 3;
            --c: #0000 64%, #000 66% 98%, #0000 101%;
            background: radial-gradient(35% 146% at 50% 159%, var(--c)) 0 0,
                radial-gradient(35% 146% at 50% -59%, var(--c)) 100% 100%;
            background-size: calc(200% / 3) 50%;
            background-repeat: repeat-x;
            clip-path: inset(0 100% 0 0);
            animation: l15 1.5s infinite linear;
        }
        &:after {
            scale: -1 1;
        }

        @media (min-width: 640px) {
            &:before,
            &:after {
                height: 60px;
            }
        }
        @keyframes l15 {
            50% {
                clip-path: inset(0);
            }
            to {
                clip-path: inset(0 0 0 100%);
            }
        }
    `;

    return (
        <div className="grid place-content-center h-content">
            <Loader />
        </div>
    );
};

export default Loader;
