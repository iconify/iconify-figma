/**
 * This file is part of the @iconify/icon-finder package.
 *
 * (c) Vjacheslav Trushkin <cyberalien@gmail.com>
 *
 * For the full copyright and license information, please view the license.txt or license.gpl.txt
 * files that were distributed with this source code.
 *
 * Licensed under Apache 2.0 or GPL 2.0 at your option.
 * If derivative product is not compatible with one of licenses, you can pick one of licenses.
 *
 * @license Apache 2.0
 * @license GPL 2.0
 */
"use strict";

import React from 'react';

const unit = 8;

const shapesData = {
    "0": {
        "paths": {
            "line": {
                "d": "M24 68h8c6 0 12 6 12 12v32c0 6-6 12-12 12H16c-6 0-12-6-12-12V80c0-6 5-12 12-12h8z"
            }
        },
        "width": 48
    },
    "1": {
        "paths": {
            "line": {
                "d": "M4 68c6 0 12 6 12 12v44H4h24"
            }
        },
        "width": 32
    },
    "2": {
        "paths": {
            "line": {
                "d": "M4 80c0-6 6-12 12-12h16c6 0 12 6 12 12v8c0 6-6 12-12 12H16c-6 0-12 6-12 12v12h40"
            }
        },
        "width": 48
    },
    "3": {
        "paths": {
            "line": {
                "d": "M4 80c0-6 6-12 12-12h16c6 0 12 6 12 12v4c0 6-6 12-12 12h-4 4c6 0 12 6 12 12v4c0 6-6 12-12 12H16c-6 0-12-6-12-12"
            }
        },
        "width": 48
    },
    "4": {
        "paths": {
            "line": {
                "d": "M4 68v20c0 6 6 12 12 12h16c6 0 12-6 12-12V68v56"
            }
        },
        "width": 48
    },
    "5": {
        "paths": {
            "line": {
                "d": "M44 68H4v24h28c6 0 12 6 12 12v8c0 6-6 12-12 12H16c-6 0-12-6-12-12"
            }
        },
        "width": 48
    },
    "6": {
        "paths": {
            "line": {
                "d": "M44 80c0-6-6-12-12-12H16c-6 0-12 6-12 12v32c0 6 6 12 12 12h16c6 0 12-6 12-12v-8c0-6-6-12-12-12H16c-6 0-12 6-12 12"
            }
        },
        "width": 48
    },
    "7": {
        "paths": {
            "line": {
                "d": "M4 68h28c6 0 12 6 12 12 0 4-6.667 18.667-20 44"
            }
        },
        "width": 48
    },
    "8": {
        "paths": {
            "line": {
                "d": "M24 68h8c6 0 12 6 12 12v4c0 6-6 12-12 12 6 0 12 6 12 12v4c0 6-6 12-12 12H16c-6 0-12-6-12-12v-4c0-6 6-12 12-12-6 0-12-6-12-12v-4c0-6 6-12 12-12h8z"
            }
        },
        "width": 48
    },
    "9": {
        "paths": {
            "line": {
                "d": "M44 88c0 6-6 12-12 12H16c-6 0-12-6-12-12v-8c0-6 6-12 12-12h16c6 0 12 6 12 12v32c0 6-6 12-12 12H16c-6 0-12-6-12-12"
            }
        },
        "width": 48
    },
    "|": {
        "paths": {
            "top-arrow": {
                "d": "M4 48l24-24 24 24"
            },
            "bottom-arrow": {
                "d": "M4 144l24 24 24-24"
            },
            "mid-line": {
                "d": "M28 48v96"
            }
        },
        "width": 56
    },
    ",": {
        "paths": {
            "line": {
                "d": "M8 124c-2 0-4-2-4-4s2-4 4-4 4 2 4 4v8c0 2-2 6-4 8"
            }
        },
        "width": 16
    },
    ".": {
        "paths": {
            "line": {
                "d": "M8 116c2 0 4 2 4 4s-2 4-4 4-4-2-4-4 2-4 4-4z"
            }
        },
        "width": 16
    },
};

const defaultOptions = {
    line: false,
    animate: false,
    height: 24
};

function IconHeight(props) {
    let {text, ...options} = props;

    let width = unit,
        height = 24 * unit,
        svg = '',
        i, char, item, scale;

    // Set options
    if (typeof options !== 'object') {
        options = {};
    }
    Object.keys(defaultOptions).forEach(option => {
        if (options[option] === void 0) {
            options[option] = defaultOptions[option];
        }
    });
    scale = height / options.height;

    // Add 1 unit for line
    if (options.line) {
        width += unit;
    }

    // Parse each character
    for (i = 0; i < text.length; i++) {
        char = text.slice(i, i + 1);
        if (shapesData[char] === void 0) {
            if (char === ' ') {
                width += unit * 2;
            }
            continue;
        }
        if (char === '|') {
            // Force line
            options.line = true;
        }

        item = shapesData[char];
        if (width > unit) {
            svg += '<g transform="translate(' + width + ')">'
        }
        Object.keys(item.paths).forEach(function(key) {
            let path = item.paths[key];
            svg += '<path d="' + path.d + '" />';
        });
        if (width > unit) {
            svg += '</g>';
        }

        width += item.width + unit;
    }

    // Add line
    if (options.line) {
        svg += '<path d="M' + (unit / 2) + ' ' + (unit / 2) + 'h' + (width - unit) + '" />';
        svg += '<path d="M' + (unit / 2) + ' ' + (height - unit / 2) + 'h' + (width - unit) + '" />';
    }

    // Wrap in group
    svg = '<g stroke-width="' + unit + '" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">' + svg + '</g>';

    // Wrap in <svg>
    return <svg
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        width={width / scale}
        height={height / scale}
        viewBox={'0 0 ' + width + ' ' + height}
        dangerouslySetInnerHTML={{__html: svg}}
    />;
}

export default IconHeight;
