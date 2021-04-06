import React from 'react';

const MdaRoundBar = ({ height, classNameAdd, ident, history }) => {

  if (history) {
    if (!height) {
      height = 107; // is this correct
    }
  }

  return (
    <span className={classNameAdd ? classNameAdd : ''}>
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="12" height="107" viewBox="0 0 12 107">
        <defs>

          <rect id={ident + "bar-with-mask-a"} width="10" height={height} x="0" y="0" />

          <linearGradient className="svg-gradient" id={ident + "bar-with-mask-b"} x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" className="stop-color-0" />
            <stop offset="100%" className="stop-color-100" />
          </linearGradient>

        </defs>
        <g fill="none" fill-rule="evenodd">
          <mask id={ident + "bar-with-mask-c"} fill="#fff">
            <use xlinkHref={"#" + ident + "bar-with-mask-a"} />
          </mask>
          <polygon fill={`url(#${ident}bar-with-mask-b)`} points="4 0 8 0 12 107 2 107" mask={`url(#${ident}bar-with-mask-c)`} />
        </g>
      </svg>
    </span>
  );
}

export default MdaRoundBar;
