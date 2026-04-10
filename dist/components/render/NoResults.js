import React from 'react';
export const RenderedNoResults = ({ noResultsClassName = '', query: _query, themeConfig })=>/*#__PURE__*/ React.createElement("div", {
        className: noResultsClassName,
        style: {
            color: themeConfig.theme.colors.noResultsText,
            fontFamily: themeConfig.theme.typography.fontFamily,
            fontSize: themeConfig.theme.typography.fontSizeSm,
            padding: '40px 20px',
            textAlign: 'center'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
        }
    }, /*#__PURE__*/ React.createElement("svg", {
        fill: "none",
        stroke: "currentColor",
        style: {
            color: themeConfig.theme.colors.metaText,
            height: '48px',
            marginBottom: '12px',
            width: '48px'
        },
        viewBox: "0 0 24 24"
    }, /*#__PURE__*/ React.createElement("path", {
        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 1
    })), /*#__PURE__*/ React.createElement("h3", {
        style: {
            color: themeConfig.theme.colors.titleText,
            fontSize: themeConfig.theme.typography.fontSizeSm,
            fontWeight: themeConfig.theme.typography.fontWeightMedium,
            margin: 0,
            marginBottom: '4px'
        }
    }, "No results found"), /*#__PURE__*/ React.createElement("p", {
        style: {
            color: themeConfig.theme.colors.descriptionText,
            fontSize: themeConfig.theme.typography.fontSizeSm,
            margin: 0
        }
    }, "Try searching for something else")));
