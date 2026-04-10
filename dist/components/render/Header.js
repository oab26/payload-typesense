import React from 'react';
export const RenderedHeader = ({ found, resultsHeaderClassName = '', themeConfig })=>/*#__PURE__*/ React.createElement("div", {
        className: resultsHeaderClassName,
        style: {
            alignItems: 'center',
            backgroundColor: themeConfig.theme.colors.headerBackground,
            borderBottom: `1px solid ${themeConfig.theme.colors.headerBorder}`,
            color: themeConfig.theme.colors.headerText,
            display: 'flex',
            fontFamily: themeConfig.theme.typography.fontFamily,
            fontSize: themeConfig.theme.spacing.headerFontSize,
            fontWeight: themeConfig.theme.typography.fontWeightMedium,
            justifyContent: 'space-between',
            padding: themeConfig.theme.spacing.headerPadding
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            alignItems: 'center',
            display: 'flex',
            gap: '8px'
        }
    }, /*#__PURE__*/ React.createElement("svg", {
        fill: "currentColor",
        style: {
            color: themeConfig.theme.colors.metaText,
            height: '16px',
            width: '16px'
        },
        viewBox: "0 0 20 20"
    }, /*#__PURE__*/ React.createElement("path", {
        clipRule: "evenodd",
        d: "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z",
        fillRule: "evenodd"
    })), /*#__PURE__*/ React.createElement("span", {
        style: {
            color: themeConfig.theme.colors.headerText,
            fontSize: themeConfig.theme.typography.fontSizeSm,
            fontWeight: themeConfig.theme.typography.fontWeightMedium
        }
    }, found, " result", found !== 1 ? 's' : '', " found")));
