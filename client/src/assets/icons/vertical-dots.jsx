import React from "react";
import PropTypes from "prop-types";

const VerticalDots = ({
    color = "currentColor",
    size = "24",
    ...otherProps
}) => {
    return (
        <svg
            aria-hidden="true"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            focusable="false"
            role="presentation"
            fill="none"
            {...otherProps}
        >
            <path
                d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill={color}
            />
        </svg>
    );
};

VerticalDots.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default VerticalDots;
