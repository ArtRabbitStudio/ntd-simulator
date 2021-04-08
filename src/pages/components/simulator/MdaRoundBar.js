import React from 'react';

const MdaRoundBar = ({ height, classNameAdd, ident, history, setup }) => {

  const defaultHeight = setup ? 150 : 107
  if (history) {
    if ( height === null || height === undefined ) {
      height = defaultHeight; // is this correct
    }
  }

  return (
    <span className={classNameAdd ? classNameAdd : ''}>
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="12" height={defaultHeight} viewBox={`0 0 12 ${defaultHeight}`}>
        <defs>
          <rect id={ident + "bar-with-mask-a"} width="10" height={height} x="0" y="0" />
          <linearGradient className="svg-gradient" id={ident + "bar-with-mask-b"} x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" className="stop-color-0" />
            <stop offset="100%" className="stop-color-100" />
          </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
          <mask id={ident + "bar-with-mask-c"} fill="#fff">
            <use xlinkHref={"#" + ident + "bar-with-mask-a"} />
          </mask>
          <polygon fill={`#EFF0F1`} points={`4 0 8 0 12 ${defaultHeight} 2 ${defaultHeight}`}/>
          <polygon fill={`url(#${ident}bar-with-mask-b)`} points={`4 0 8 0 12 ${defaultHeight} 2 ${defaultHeight}`} mask={`url(#${ident}bar-with-mask-c)`} />
        </g>
      </svg>
    </span>
  );
}

export default MdaRoundBar;
