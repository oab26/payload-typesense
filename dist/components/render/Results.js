import React from 'react';
export function RenderedResult({ index, onResultClick, renderDate = true, result, resultItemClassName = '', resultsContainerClassName = '', themeConfig }) {
    return /*#__PURE__*/ React.createElement("div", {
        className: resultsContainerClassName,
        style: {
            backgroundColor: themeConfig.theme.colors.resultBackground,
            borderBottom: `1px solid ${themeConfig.theme.colors.resultBorder}`,
            cursor: 'pointer',
            transition: themeConfig.config.enableAnimations !== false ? `all ${themeConfig.theme.animations.transitionFast} ${themeConfig.theme.animations.easeInOut}` : 'none'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: `${themeConfig.classes.resultItem} ${resultItemClassName}`,
        "data-result-item": true,
        key: result.document?.id || result.id || index,
        onBlur: (e)=>{
            e.currentTarget.style.backgroundColor = themeConfig.theme.colors.resultBackground;
        },
        onClick: ()=>onResultClick(result),
        onFocus: (e)=>{
            e.currentTarget.style.backgroundColor = themeConfig.theme.colors.resultBackgroundFocus;
        },
        onKeyDown: (e)=>{
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onResultClick(result);
            }
        },
        onMouseEnter: (e)=>{
            e.currentTarget.style.backgroundColor = themeConfig.theme.colors.resultBackgroundHover;
        },
        onMouseLeave: (e)=>{
            e.currentTarget.style.backgroundColor = themeConfig.theme.colors.resultBackground;
        },
        role: "button",
        tabIndex: 0
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            alignItems: 'flex-start',
            display: 'flex',
            gap: '12px',
            overflow: 'hidden',
            padding: '6px'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            flexShrink: 0
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            alignItems: 'center',
            backgroundColor: themeConfig.theme.colors.collectionBadge,
            borderRadius: themeConfig.theme.spacing.inputBorderRadius,
            color: themeConfig.theme.colors.collectionBadgeText,
            display: 'flex',
            fontSize: themeConfig.theme.typography.fontSizeBase,
            fontWeight: themeConfig.theme.typography.fontWeightMedium,
            height: '32px',
            justifyContent: 'center',
            width: '32px'
        }
    }, result.collection?.charAt(0).toUpperCase() || '📄')), /*#__PURE__*/ React.createElement("div", {
        style: {
            flex: 1,
            minWidth: 0
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
        }
    }, /*#__PURE__*/ React.createElement("h3", {
        style: {
            color: themeConfig.theme.colors.titleText,
            fontFamily: themeConfig.theme.typography.fontFamily,
            fontSize: themeConfig.theme.typography.fontSizeBase,
            fontWeight: themeConfig.theme.typography.fontWeightSemibold,
            lineHeight: themeConfig.theme.typography.lineHeightTight,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
    }, result.document?.title || result.document?.name || result.title || 'Untitled')), (result.highlight?.title?.snippet || result.highlight?.content?.snippet) && /*#__PURE__*/ React.createElement("div", {
        dangerouslySetInnerHTML: {
            __html: result.highlight?.title?.snippet || result.highlight?.content?.snippet || ''
        },
        style: {
            color: themeConfig.theme.colors.descriptionText,
            display: '-webkit-box',
            fontSize: themeConfig.theme.typography.fontSizeSm,
            fontWeight: themeConfig.theme.typography.fontWeightNormal,
            lineHeight: themeConfig.theme.typography.lineHeightNormal,
            marginTop: '4px',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2
        }
    }), /*#__PURE__*/ React.createElement("div", {
        style: {
            alignItems: 'center',
            color: themeConfig.theme.colors.metaText,
            display: 'flex',
            fontSize: themeConfig.theme.typography.fontSizeXs,
            gap: '12px',
            marginTop: '8px'
        }
    }, result.collection && /*#__PURE__*/ React.createElement("span", {
        style: {
            alignItems: 'center',
            display: 'inline-flex'
        }
    }, /*#__PURE__*/ React.createElement("svg", {
        fill: "currentColor",
        style: {
            height: '12px',
            marginRight: '4px',
            width: '12px'
        },
        viewBox: "0 0 20 20"
    }, /*#__PURE__*/ React.createElement("path", {
        clipRule: "evenodd",
        d: "M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z",
        fillRule: "evenodd"
    })), result.collection), renderDate && (result.document?.updatedAt || result.updatedAt) && /*#__PURE__*/ React.createElement("span", {
        style: {
            alignItems: 'center',
            display: 'inline-flex'
        }
    }, /*#__PURE__*/ React.createElement("svg", {
        fill: "currentColor",
        style: {
            height: '12px',
            marginRight: '4px',
            width: '12px'
        },
        viewBox: "0 0 20 20"
    }, /*#__PURE__*/ React.createElement("path", {
        clipRule: "evenodd",
        d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z",
        fillRule: "evenodd"
    })), new Date(result.document?.updatedAt || result.updatedAt).toLocaleDateString()))))));
}
