'use client';
import React, { useEffect, useRef, useState } from 'react';
import { handleKeyboard } from '../utils/keyboard.js';
import { useDebounce } from '../utils/useDebounce.js';
import { useSearch } from '../utils/useSearch.js';
import { RenderedHeader, RenderedNoResults, RenderedResult, RenderedResultError } from './render/index.js';
import { useThemeConfig } from './themes/hooks.js';
export function HeadlessSearchInput(props) {
    const { baseUrl, className = '', collections, debounceMs = 300, enableSuggestions: _enableSuggestions = true, errorClassName = '', inputClassName = '', inputWrapperClassName = '', minQueryLength = 2, noResultsClassName = '', onResultClick, onResults, onSearch, perPage = 10, placeholder = 'Search...', renderDate = true, renderError, renderInput, renderNoResults, renderResult, renderResultsHeader, resultItemClassName = '', resultsClassName = '', resultsContainerClassName = '', resultsHeaderClassName = '', resultsListClassName = '', showLoading = true, showResultCount = true, theme = 'modern', vector = false } = props;
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const themeConfig = useThemeConfig({
        theme: typeof theme === 'string' ? theme : theme.theme || 'modern',
        ...typeof theme === 'object' ? theme : {}
    });
    const debouncedQuery = useDebounce(query, debounceMs);
    const { error, isLoading, results, search } = useSearch({
        baseUrl,
        collections,
        minQueryLength,
        onResults,
        onSearch,
        perPage,
        vector
    });
    useEffect(()=>{
        if (debouncedQuery.length >= minQueryLength) {
            void search(debouncedQuery);
        }
    }, [
        debouncedQuery,
        minQueryLength,
        search
    ]);
    const handleInputChange = (e)=>{
        const value = e.target.value;
        setQuery(value);
        setIsOpen(value.length >= minQueryLength);
    };
    const handleInputFocus = ()=>{
        if (query.length >= minQueryLength) {
            setIsOpen(true);
        }
    };
    const handleInputBlur = (_e)=>{
        setTimeout(()=>{
            if (!resultsRef.current?.contains(document.activeElement)) {
                setIsOpen(false);
            }
        }, 150);
    };
    const handleResultClick = (result)=>{
        onResultClick?.(result);
        setIsOpen(false);
        setQuery('');
    };
    const handleKeyDown = (e)=>{
        handleKeyboard(e, {
            inputRef,
            isOpen,
            results,
            resultsRef
        });
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: className,
        style: {
            margin: '0 auto',
            maxWidth: '600px',
            position: 'relative',
            width: '100%'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: inputWrapperClassName,
        style: {
            position: 'relative',
            width: '100%'
        }
    }, renderInput ? renderInput({
        className: inputClassName,
        onBlur: handleInputBlur,
        onChange: handleInputChange,
        onFocus: handleInputFocus,
        onKeyDown: handleKeyDown,
        placeholder,
        ref: inputRef,
        value: query
    }) : /*#__PURE__*/ React.createElement("input", {
        "aria-label": "Search input",
        autoComplete: "off",
        className: inputClassName,
        onBlur: (e)=>{
            e.target.style.borderColor = themeConfig.theme.colors.inputBorder;
            e.target.style.boxShadow = 'none';
            handleInputBlur(e);
        },
        onChange: handleInputChange,
        onFocus: (e)=>{
            e.target.style.borderColor = themeConfig.theme.colors.inputBorderFocus;
            e.target.style.boxShadow = themeConfig.config.enableShadows !== false ? `0 0 0 3px ${themeConfig.theme.colors.inputBorderFocus}20` : 'none';
            handleInputFocus();
        },
        onKeyDown: handleKeyDown,
        placeholder: placeholder,
        ref: inputRef,
        style: {
            backgroundColor: themeConfig.theme.colors.inputBackground,
            border: `2px solid ${themeConfig.theme.colors.inputBorder}`,
            borderRadius: themeConfig.config.enableRoundedCorners !== false ? themeConfig.theme.spacing.inputBorderRadius : '0',
            boxShadow: 'none',
            color: themeConfig.theme.colors.inputText,
            fontFamily: themeConfig.theme.typography.fontFamily,
            fontSize: themeConfig.theme.spacing.inputFontSize,
            fontWeight: themeConfig.theme.typography.fontWeightNormal,
            lineHeight: themeConfig.theme.typography.lineHeightNormal,
            outline: 'none',
            padding: themeConfig.theme.spacing.inputPadding,
            transition: themeConfig.config.enableAnimations !== false ? `all ${themeConfig.theme.animations.transitionNormal} ${themeConfig.theme.animations.easeInOut}` : 'none',
            width: '100%'
        },
        title: "Search input",
        type: "text",
        value: query
    }), isLoading && showLoading && /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)'
        }
    }, /*#__PURE__*/ React.createElement("style", null, `
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `), /*#__PURE__*/ React.createElement("div", {
        "data-testid": "loading-spinner",
        style: {
            animation: `spin 1s linear infinite`,
            border: `2px solid ${themeConfig.theme.colors.inputBorder}`,
            borderRadius: '50%',
            borderTop: `2px solid ${themeConfig.theme.colors.inputBorderFocus}`,
            height: '16px',
            width: '16px'
        }
    }))), isOpen && results && /*#__PURE__*/ React.createElement("div", {
        className: resultsContainerClassName,
        ref: resultsRef,
        style: {
            backgroundColor: themeConfig.theme.colors.resultsBackground,
            border: `1px solid ${themeConfig.theme.colors.resultsBorder}`,
            borderRadius: themeConfig.config.enableRoundedCorners !== false ? themeConfig.theme.spacing.resultsBorderRadius : '0',
            boxShadow: themeConfig.config.enableShadows !== false ? themeConfig.theme.shadows.shadowLg : 'none',
            boxSizing: 'border-box',
            display: 'flex',
            left: '0',
            marginTop: '10px',
            maxHeight: themeConfig.theme.spacing.resultsMaxHeight,
            overflow: 'hidden',
            padding: '4px',
            position: 'absolute',
            right: '0',
            top: '100%',
            zIndex: 1000,
            ...themeConfig.config.enableAnimations !== false && {
                animation: `slideDown ${themeConfig.theme.animations.animationNormal} ${themeConfig.theme.animations.easeOut}`
            }
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: `relative ${resultsClassName}`,
        style: {
            minHeight: 0,
            overflowY: 'auto'
        }
    }, error && (renderError ? renderError(error) : /*#__PURE__*/ React.createElement(RenderedResultError, {
        error: error,
        errorClassName: errorClassName,
        themeConfig: themeConfig
    })), !error && results && /*#__PURE__*/ React.createElement(React.Fragment, null, showResultCount && (renderResultsHeader ? renderResultsHeader(results.found) : /*#__PURE__*/ React.createElement(RenderedHeader, {
        found: results.found,
        resultsHeaderClassName: resultsHeaderClassName,
        themeConfig: themeConfig
    })), results.hits.length > 0 ? /*#__PURE__*/ React.createElement("div", {
        className: resultsListClassName
    }, results.hits.map((result, index)=>renderResult ? renderResult(result, index, {
            onClick: handleResultClick
        }) : /*#__PURE__*/ React.createElement(RenderedResult, {
            index: index,
            key: result.document?.id || result.id || index,
            onResultClick: handleResultClick,
            renderDate: renderDate,
            result: result,
            resultItemClassName: resultItemClassName,
            resultsContainerClassName: resultsContainerClassName,
            themeConfig: themeConfig
        }))) : renderNoResults ? renderNoResults(query) : /*#__PURE__*/ React.createElement(RenderedNoResults, {
        noResultsClassName: noResultsClassName,
        query: query,
        themeConfig: themeConfig
    })))));
}
export default HeadlessSearchInput;
