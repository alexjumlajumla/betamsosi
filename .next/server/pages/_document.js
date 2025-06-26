"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_document";
exports.ids = ["pages/_document"];
exports.modules = {

/***/ "(pages-dir-node)/./pages/_document.tsx":
/*!*****************************!*\
  !*** ./pages/_document.tsx ***!
  \*****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyDocument)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/document */ \"(pages-dir-node)/./node_modules/next/document.js\");\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_document__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _emotion_server_create_instance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/server/create-instance */ \"@emotion/server/create-instance\");\n/* harmony import */ var utils_createEmotionCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! utils/createEmotionCache */ \"(pages-dir-node)/./utils/createEmotionCache.ts\");\n/* harmony import */ var utils_session__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! utils/session */ \"(pages-dir-node)/./utils/session.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_emotion_server_create_instance__WEBPACK_IMPORTED_MODULE_2__, utils_createEmotionCache__WEBPACK_IMPORTED_MODULE_3__, utils_session__WEBPACK_IMPORTED_MODULE_4__]);\n([_emotion_server_create_instance__WEBPACK_IMPORTED_MODULE_2__, utils_createEmotionCache__WEBPACK_IMPORTED_MODULE_3__, utils_session__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\nfunction MyDocument({ emotionStyleTags }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Html, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Head, {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"emotion-insertion-point\",\n                        content: \"\"\n                    }, void 0, false, {\n                        fileName: \"/Users/mac/Downloads/betamsosi/pages/_document.tsx\",\n                        lineNumber: 25,\n                        columnNumber: 9\n                    }, this),\n                    emotionStyleTags\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/mac/Downloads/betamsosi/pages/_document.tsx\",\n                lineNumber: 24,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"body\", {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.Main, {}, void 0, false, {\n                        fileName: \"/Users/mac/Downloads/betamsosi/pages/_document.tsx\",\n                        lineNumber: 29,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_document__WEBPACK_IMPORTED_MODULE_1__.NextScript, {}, void 0, false, {\n                        fileName: \"/Users/mac/Downloads/betamsosi/pages/_document.tsx\",\n                        lineNumber: 30,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/mac/Downloads/betamsosi/pages/_document.tsx\",\n                lineNumber: 28,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/mac/Downloads/betamsosi/pages/_document.tsx\",\n        lineNumber: 23,\n        columnNumber: 5\n    }, this);\n}\nMyDocument.getInitialProps = async (ctx)=>{\n    const originalRenderPage = ctx.renderPage;\n    const appDirection = (0,utils_session__WEBPACK_IMPORTED_MODULE_4__.getCookie)(\"dir\", ctx);\n    const cache = appDirection === \"rtl\" ? (0,utils_createEmotionCache__WEBPACK_IMPORTED_MODULE_3__.createRtlEmotionCache)() : (0,utils_createEmotionCache__WEBPACK_IMPORTED_MODULE_3__.createEmotionCache)();\n    const { extractCriticalToChunks } = (0,_emotion_server_create_instance__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(cache);\n    ctx.renderPage = ()=>originalRenderPage({\n            enhanceApp: (App)=>function EnhanceApp(props) {\n                    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(App, {\n                        emotionCache: cache,\n                        ...props\n                    }, void 0, false, {\n                        fileName: \"/Users/mac/Downloads/betamsosi/pages/_document.tsx\",\n                        lineNumber: 47,\n                        columnNumber: 18\n                    }, this);\n                }\n        });\n    const initialProps = await next_document__WEBPACK_IMPORTED_MODULE_1___default().getInitialProps(ctx);\n    const emotionStyles = extractCriticalToChunks(initialProps.html);\n    const emotionStyleTags = emotionStyles.styles.map((style)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"style\", {\n            \"data-emotion\": `${style.key} ${style.ids.join(\" \")}`,\n            // eslint-disable-next-line react/no-danger\n            dangerouslySetInnerHTML: {\n                __html: style.css\n            }\n        }, style.key, false, {\n            fileName: \"/Users/mac/Downloads/betamsosi/pages/_document.tsx\",\n            lineNumber: 54,\n            columnNumber: 5\n        }, undefined));\n    return {\n        ...initialProps,\n        emotionStyleTags\n    };\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19kb2N1bWVudC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBT3VCO0FBQzJDO0FBSWhDO0FBRVE7QUFNM0IsU0FBU1MsV0FBVyxFQUFFQyxnQkFBZ0IsRUFBbUI7SUFDdEUscUJBQ0UsOERBQUNULCtDQUFJQTs7MEJBQ0gsOERBQUNDLCtDQUFJQTs7a0NBQ0gsOERBQUNTO3dCQUFLQyxNQUFLO3dCQUEwQkMsU0FBUTs7Ozs7O29CQUM1Q0g7Ozs7Ozs7MEJBRUgsOERBQUNJOztrQ0FDQyw4REFBQ1gsK0NBQUlBOzs7OztrQ0FDTCw4REFBQ0MscURBQVVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQUluQjtBQUVBSyxXQUFXTSxlQUFlLEdBQUcsT0FBT0M7SUFDbEMsTUFBTUMscUJBQXFCRCxJQUFJRSxVQUFVO0lBQ3pDLE1BQU1DLGVBQWVYLHdEQUFTQSxDQUFDLE9BQU9RO0lBQ3RDLE1BQU1JLFFBQ0pELGlCQUFpQixRQUFRWiwrRUFBcUJBLEtBQUtELDRFQUFrQkE7SUFDdkUsTUFBTSxFQUFFZSx1QkFBdUIsRUFBRSxHQUFHaEIsMkVBQW1CQSxDQUFDZTtJQUV4REosSUFBSUUsVUFBVSxHQUFHLElBQ2ZELG1CQUFtQjtZQUNqQkssWUFBWSxDQUFDQyxNQUNYLFNBQVNDLFdBQVdDLEtBQUs7b0JBQ3ZCLHFCQUFPLDhEQUFDRjt3QkFBSUcsY0FBY047d0JBQVEsR0FBR0ssS0FBSzs7Ozs7O2dCQUM1QztRQUNKO0lBRUYsTUFBTUUsZUFBZSxNQUFNM0Isb0VBQXdCLENBQUNnQjtJQUNwRCxNQUFNWSxnQkFBZ0JQLHdCQUF3Qk0sYUFBYUUsSUFBSTtJQUMvRCxNQUFNbkIsbUJBQW1Ca0IsY0FBY0UsTUFBTSxDQUFDQyxHQUFHLENBQUMsQ0FBQ0Msc0JBQ2pELDhEQUFDQTtZQUNDQyxnQkFBYyxHQUFHRCxNQUFNRSxHQUFHLENBQUMsQ0FBQyxFQUFFRixNQUFNRyxHQUFHLENBQUNDLElBQUksQ0FBQyxNQUFNO1lBRW5ELDJDQUEyQztZQUMzQ0MseUJBQXlCO2dCQUFFQyxRQUFRTixNQUFNTyxHQUFHO1lBQUM7V0FGeENQLE1BQU1FLEdBQUc7Ozs7O0lBTWxCLE9BQU87UUFDTCxHQUFHUCxZQUFZO1FBQ2ZqQjtJQUNGO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYWMvRG93bmxvYWRzL2JldGFtc29zaS9wYWdlcy9fZG9jdW1lbnQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb2N1bWVudCwge1xuICBIdG1sLFxuICBIZWFkLFxuICBNYWluLFxuICBOZXh0U2NyaXB0LFxuICBEb2N1bWVudFByb3BzLFxuICBEb2N1bWVudENvbnRleHQsXG59IGZyb20gXCJuZXh0L2RvY3VtZW50XCI7XG5pbXBvcnQgY3JlYXRlRW1vdGlvblNlcnZlciBmcm9tIFwiQGVtb3Rpb24vc2VydmVyL2NyZWF0ZS1pbnN0YW5jZVwiO1xuaW1wb3J0IHtcbiAgY3JlYXRlRW1vdGlvbkNhY2hlLFxuICBjcmVhdGVSdGxFbW90aW9uQ2FjaGUsXG59IGZyb20gXCJ1dGlscy9jcmVhdGVFbW90aW9uQ2FjaGVcIjtcbmltcG9ydCB7IGpzeCB9IGZyb20gXCJAZW1vdGlvbi9yZWFjdFwiO1xuaW1wb3J0IHsgZ2V0Q29va2llIH0gZnJvbSBcInV0aWxzL3Nlc3Npb25cIjtcblxuaW50ZXJmYWNlIE15RG9jdW1lbnRQcm9wcyBleHRlbmRzIERvY3VtZW50UHJvcHMge1xuICBlbW90aW9uU3R5bGVUYWdzOiBqc3guSlNYLkVsZW1lbnRbXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTXlEb2N1bWVudCh7IGVtb3Rpb25TdHlsZVRhZ3MgfTogTXlEb2N1bWVudFByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPEh0bWw+XG4gICAgICA8SGVhZD5cbiAgICAgICAgPG1ldGEgbmFtZT1cImVtb3Rpb24taW5zZXJ0aW9uLXBvaW50XCIgY29udGVudD1cIlwiIC8+XG4gICAgICAgIHtlbW90aW9uU3R5bGVUYWdzfVxuICAgICAgPC9IZWFkPlxuICAgICAgPGJvZHk+XG4gICAgICAgIDxNYWluIC8+XG4gICAgICAgIDxOZXh0U2NyaXB0IC8+XG4gICAgICA8L2JvZHk+XG4gICAgPC9IdG1sPlxuICApO1xufVxuXG5NeURvY3VtZW50LmdldEluaXRpYWxQcm9wcyA9IGFzeW5jIChjdHg6IERvY3VtZW50Q29udGV4dCkgPT4ge1xuICBjb25zdCBvcmlnaW5hbFJlbmRlclBhZ2UgPSBjdHgucmVuZGVyUGFnZTtcbiAgY29uc3QgYXBwRGlyZWN0aW9uID0gZ2V0Q29va2llKFwiZGlyXCIsIGN0eCk7XG4gIGNvbnN0IGNhY2hlID1cbiAgICBhcHBEaXJlY3Rpb24gPT09IFwicnRsXCIgPyBjcmVhdGVSdGxFbW90aW9uQ2FjaGUoKSA6IGNyZWF0ZUVtb3Rpb25DYWNoZSgpO1xuICBjb25zdCB7IGV4dHJhY3RDcml0aWNhbFRvQ2h1bmtzIH0gPSBjcmVhdGVFbW90aW9uU2VydmVyKGNhY2hlKTtcblxuICBjdHgucmVuZGVyUGFnZSA9ICgpID0+XG4gICAgb3JpZ2luYWxSZW5kZXJQYWdlKHtcbiAgICAgIGVuaGFuY2VBcHA6IChBcHA6IGFueSkgPT5cbiAgICAgICAgZnVuY3Rpb24gRW5oYW5jZUFwcChwcm9wcykge1xuICAgICAgICAgIHJldHVybiA8QXBwIGVtb3Rpb25DYWNoZT17Y2FjaGV9IHsuLi5wcm9wc30gLz47XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgY29uc3QgaW5pdGlhbFByb3BzID0gYXdhaXQgRG9jdW1lbnQuZ2V0SW5pdGlhbFByb3BzKGN0eCk7XG4gIGNvbnN0IGVtb3Rpb25TdHlsZXMgPSBleHRyYWN0Q3JpdGljYWxUb0NodW5rcyhpbml0aWFsUHJvcHMuaHRtbCk7XG4gIGNvbnN0IGVtb3Rpb25TdHlsZVRhZ3MgPSBlbW90aW9uU3R5bGVzLnN0eWxlcy5tYXAoKHN0eWxlKSA9PiAoXG4gICAgPHN0eWxlXG4gICAgICBkYXRhLWVtb3Rpb249e2Ake3N0eWxlLmtleX0gJHtzdHlsZS5pZHMuam9pbihcIiBcIil9YH1cbiAgICAgIGtleT17c3R5bGUua2V5fVxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLWRhbmdlclxuICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBzdHlsZS5jc3MgfX1cbiAgICAvPlxuICApKTtcblxuICByZXR1cm4ge1xuICAgIC4uLmluaXRpYWxQcm9wcyxcbiAgICBlbW90aW9uU3R5bGVUYWdzLFxuICB9O1xufTtcbiJdLCJuYW1lcyI6WyJEb2N1bWVudCIsIkh0bWwiLCJIZWFkIiwiTWFpbiIsIk5leHRTY3JpcHQiLCJjcmVhdGVFbW90aW9uU2VydmVyIiwiY3JlYXRlRW1vdGlvbkNhY2hlIiwiY3JlYXRlUnRsRW1vdGlvbkNhY2hlIiwiZ2V0Q29va2llIiwiTXlEb2N1bWVudCIsImVtb3Rpb25TdHlsZVRhZ3MiLCJtZXRhIiwibmFtZSIsImNvbnRlbnQiLCJib2R5IiwiZ2V0SW5pdGlhbFByb3BzIiwiY3R4Iiwib3JpZ2luYWxSZW5kZXJQYWdlIiwicmVuZGVyUGFnZSIsImFwcERpcmVjdGlvbiIsImNhY2hlIiwiZXh0cmFjdENyaXRpY2FsVG9DaHVua3MiLCJlbmhhbmNlQXBwIiwiQXBwIiwiRW5oYW5jZUFwcCIsInByb3BzIiwiZW1vdGlvbkNhY2hlIiwiaW5pdGlhbFByb3BzIiwiZW1vdGlvblN0eWxlcyIsImh0bWwiLCJzdHlsZXMiLCJtYXAiLCJzdHlsZSIsImRhdGEtZW1vdGlvbiIsImtleSIsImlkcyIsImpvaW4iLCJkYW5nZXJvdXNseVNldElubmVySFRNTCIsIl9faHRtbCIsImNzcyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_document.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./utils/createEmotionCache.ts":
/*!*************************************!*\
  !*** ./utils/createEmotionCache.ts ***!
  \*************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createEmotionCache: () => (/* binding */ createEmotionCache),\n/* harmony export */   createRtlEmotionCache: () => (/* binding */ createRtlEmotionCache)\n/* harmony export */ });\n/* harmony import */ var _emotion_cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/cache */ \"@emotion/cache\");\n/* harmony import */ var stylis_plugin_rtl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stylis-plugin-rtl */ \"stylis-plugin-rtl\");\n/* harmony import */ var stylis_plugin_rtl__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(stylis_plugin_rtl__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var stylis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! stylis */ \"stylis\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_emotion_cache__WEBPACK_IMPORTED_MODULE_0__, stylis__WEBPACK_IMPORTED_MODULE_2__]);\n([_emotion_cache__WEBPACK_IMPORTED_MODULE_0__, stylis__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\nconst isBrowser = typeof document !== \"undefined\";\n// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.\n// This assures that MUI styles are loaded first.\n// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.\nfunction createEmotionCache() {\n    let insertionPoint;\n    if (isBrowser) {\n        const emotionInsertionPoint = document.querySelector('meta[name=\"emotion-insertion-point\"]');\n        insertionPoint = emotionInsertionPoint ?? undefined;\n    }\n    return (0,_emotion_cache__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n        key: \"mui-style\",\n        insertionPoint\n    });\n}\nfunction createRtlEmotionCache() {\n    let insertionPoint;\n    if (isBrowser) {\n        const emotionInsertionPoint = document.querySelector('meta[name=\"emotion-insertion-point\"]');\n        insertionPoint = emotionInsertionPoint ?? undefined;\n    }\n    return (0,_emotion_cache__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n        key: \"mui-style\",\n        insertionPoint,\n        stylisPlugins: [\n            stylis__WEBPACK_IMPORTED_MODULE_2__.prefixer,\n            (stylis_plugin_rtl__WEBPACK_IMPORTED_MODULE_1___default())\n        ]\n    });\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3V0aWxzL2NyZWF0ZUVtb3Rpb25DYWNoZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBeUM7QUFDQztBQUNSO0FBRWxDLE1BQU1HLFlBQVksT0FBT0MsYUFBYTtBQUV0QywrRkFBK0Y7QUFDL0YsaURBQWlEO0FBQ2pELHFHQUFxRztBQUM5RixTQUFTQztJQUNkLElBQUlDO0lBRUosSUFBSUgsV0FBVztRQUNiLE1BQU1JLHdCQUF3QkgsU0FBU0ksYUFBYSxDQUNsRDtRQUVGRixpQkFBaUJDLHlCQUF5QkU7SUFDNUM7SUFFQSxPQUFPVCwwREFBV0EsQ0FBQztRQUNqQlUsS0FBSztRQUNMSjtJQUNGO0FBQ0Y7QUFFTyxTQUFTSztJQUNkLElBQUlMO0lBRUosSUFBSUgsV0FBVztRQUNiLE1BQU1JLHdCQUF3QkgsU0FBU0ksYUFBYSxDQUNsRDtRQUVGRixpQkFBaUJDLHlCQUF5QkU7SUFDNUM7SUFFQSxPQUFPVCwwREFBV0EsQ0FBQztRQUNqQlUsS0FBSztRQUNMSjtRQUNBTSxlQUFlO1lBQUNWLDRDQUFRQTtZQUFFRCwwREFBU0E7U0FBQztJQUN0QztBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvbWFjL0Rvd25sb2Fkcy9iZXRhbXNvc2kvdXRpbHMvY3JlYXRlRW1vdGlvbkNhY2hlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVDYWNoZSBmcm9tIFwiQGVtb3Rpb24vY2FjaGVcIjtcbmltcG9ydCBydGxQbHVnaW4gZnJvbSBcInN0eWxpcy1wbHVnaW4tcnRsXCI7XG5pbXBvcnQgeyBwcmVmaXhlciB9IGZyb20gXCJzdHlsaXNcIjtcblxuY29uc3QgaXNCcm93c2VyID0gdHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiO1xuXG4vLyBPbiB0aGUgY2xpZW50IHNpZGUsIENyZWF0ZSBhIG1ldGEgdGFnIGF0IHRoZSB0b3Agb2YgdGhlIDxoZWFkPiBhbmQgc2V0IGl0IGFzIGluc2VydGlvblBvaW50LlxuLy8gVGhpcyBhc3N1cmVzIHRoYXQgTVVJIHN0eWxlcyBhcmUgbG9hZGVkIGZpcnN0LlxuLy8gSXQgYWxsb3dzIGRldmVsb3BlcnMgdG8gZWFzaWx5IG92ZXJyaWRlIE1VSSBzdHlsZXMgd2l0aCBvdGhlciBzdHlsaW5nIHNvbHV0aW9ucywgbGlrZSBDU1MgbW9kdWxlcy5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbW90aW9uQ2FjaGUoKSB7XG4gIGxldCBpbnNlcnRpb25Qb2ludDtcblxuICBpZiAoaXNCcm93c2VyKSB7XG4gICAgY29uc3QgZW1vdGlvbkluc2VydGlvblBvaW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MTWV0YUVsZW1lbnQ+KFxuICAgICAgJ21ldGFbbmFtZT1cImVtb3Rpb24taW5zZXJ0aW9uLXBvaW50XCJdJ1xuICAgICk7XG4gICAgaW5zZXJ0aW9uUG9pbnQgPSBlbW90aW9uSW5zZXJ0aW9uUG9pbnQgPz8gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIGNyZWF0ZUNhY2hlKHtcbiAgICBrZXk6IFwibXVpLXN0eWxlXCIsXG4gICAgaW5zZXJ0aW9uUG9pbnQsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUnRsRW1vdGlvbkNhY2hlKCkge1xuICBsZXQgaW5zZXJ0aW9uUG9pbnQ7XG5cbiAgaWYgKGlzQnJvd3Nlcikge1xuICAgIGNvbnN0IGVtb3Rpb25JbnNlcnRpb25Qb2ludCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTE1ldGFFbGVtZW50PihcbiAgICAgICdtZXRhW25hbWU9XCJlbW90aW9uLWluc2VydGlvbi1wb2ludFwiXSdcbiAgICApO1xuICAgIGluc2VydGlvblBvaW50ID0gZW1vdGlvbkluc2VydGlvblBvaW50ID8/IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBjcmVhdGVDYWNoZSh7XG4gICAga2V5OiBcIm11aS1zdHlsZVwiLFxuICAgIGluc2VydGlvblBvaW50LFxuICAgIHN0eWxpc1BsdWdpbnM6IFtwcmVmaXhlciwgcnRsUGx1Z2luXSxcbiAgfSk7XG59XG4iXSwibmFtZXMiOlsiY3JlYXRlQ2FjaGUiLCJydGxQbHVnaW4iLCJwcmVmaXhlciIsImlzQnJvd3NlciIsImRvY3VtZW50IiwiY3JlYXRlRW1vdGlvbkNhY2hlIiwiaW5zZXJ0aW9uUG9pbnQiLCJlbW90aW9uSW5zZXJ0aW9uUG9pbnQiLCJxdWVyeVNlbGVjdG9yIiwidW5kZWZpbmVkIiwia2V5IiwiY3JlYXRlUnRsRW1vdGlvbkNhY2hlIiwic3R5bGlzUGx1Z2lucyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/./utils/createEmotionCache.ts\n");

/***/ }),

/***/ "(pages-dir-node)/./utils/session.ts":
/*!**************************!*\
  !*** ./utils/session.ts ***!
  \**************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getCookie: () => (/* binding */ getCookie),\n/* harmony export */   getCookieFromBrowser: () => (/* binding */ getCookieFromBrowser),\n/* harmony export */   getCookieFromServer: () => (/* binding */ getCookieFromServer),\n/* harmony export */   removeCookie: () => (/* binding */ removeCookie),\n/* harmony export */   setCookie: () => (/* binding */ setCookie)\n/* harmony export */ });\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ \"js-cookie\");\n/* harmony import */ var next_cookies__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-cookies */ \"next-cookies\");\n/* harmony import */ var next_cookies__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_cookies__WEBPACK_IMPORTED_MODULE_1__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([js_cookie__WEBPACK_IMPORTED_MODULE_0__]);\njs_cookie__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nconst isBrowser = \"undefined\" !== \"undefined\";\nconst getCookieFromBrowser = (key)=>{\n    return js_cookie__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get(key);\n};\nconst getCookieFromServer = (ctx, key = \"id_token\")=>{\n    const cookie = next_cookies__WEBPACK_IMPORTED_MODULE_1___default()(ctx);\n    const token = cookie && cookie[key] ? cookie[key] : false;\n    if (!token) {\n        return null;\n    }\n    return token;\n};\nconst getCookie = (key, context)=>{\n    return isBrowser ? getCookieFromBrowser(key) : getCookieFromServer(context, key);\n};\nconst setCookie = (key, token)=>{\n    js_cookie__WEBPACK_IMPORTED_MODULE_0__[\"default\"].set(key, token, {\n        expires: 7\n    });\n};\nconst removeCookie = (key)=>{\n    js_cookie__WEBPACK_IMPORTED_MODULE_0__[\"default\"].remove(key);\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3V0aWxzL3Nlc3Npb24udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0I7QUFDTztBQUV0QyxNQUFNRSxZQUFZLGdCQUFrQjtBQUU3QixNQUFNQyx1QkFBdUIsQ0FBQ0M7SUFDbkMsT0FBT0oscURBQVUsQ0FBQ0k7QUFDcEIsRUFBRTtBQUVLLE1BQU1FLHNCQUFzQixDQUFDQyxLQUFVSCxNQUFNLFVBQVU7SUFDNUQsTUFBTUosU0FBU0MsbURBQVVBLENBQUNNO0lBQzFCLE1BQU1DLFFBQVFSLFVBQVVBLE1BQU0sQ0FBQ0ksSUFBSSxHQUFHSixNQUFNLENBQUNJLElBQUksR0FBRztJQUNwRCxJQUFJLENBQUNJLE9BQU87UUFDVixPQUFPO0lBQ1Q7SUFDQSxPQUFPQTtBQUNULEVBQUU7QUFFSyxNQUFNQyxZQUFZLENBQUNMLEtBQWFNO0lBQ3JDLE9BQU9SLFlBQ0hDLHFCQUFxQkMsT0FDckJFLG9CQUFvQkksU0FBU047QUFDbkMsRUFBRTtBQUVLLE1BQU1PLFlBQVksQ0FBQ1AsS0FBYUk7SUFDckNSLHFEQUFVLENBQUNJLEtBQUtJLE9BQU87UUFBRUssU0FBUztJQUFFO0FBQ3RDLEVBQUU7QUFFSyxNQUFNQyxlQUFlLENBQUNWO0lBQzNCSix3REFBYSxDQUFDSTtBQUNoQixFQUFFIiwic291cmNlcyI6WyIvVXNlcnMvbWFjL0Rvd25sb2Fkcy9iZXRhbXNvc2kvdXRpbHMvc2Vzc2lvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29va2llIGZyb20gXCJqcy1jb29raWVcIjtcbmltcG9ydCBuZXh0Q29va2llIGZyb20gXCJuZXh0LWNvb2tpZXNcIjtcblxuY29uc3QgaXNCcm93c2VyID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIjtcblxuZXhwb3J0IGNvbnN0IGdldENvb2tpZUZyb21Ccm93c2VyID0gKGtleTogc3RyaW5nKTogYW55ID0+IHtcbiAgcmV0dXJuIGNvb2tpZS5nZXQoa2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRDb29raWVGcm9tU2VydmVyID0gKGN0eDogYW55LCBrZXkgPSBcImlkX3Rva2VuXCIpID0+IHtcbiAgY29uc3QgY29va2llID0gbmV4dENvb2tpZShjdHgpO1xuICBjb25zdCB0b2tlbiA9IGNvb2tpZSAmJiBjb29raWVba2V5XSA/IGNvb2tpZVtrZXldIDogZmFsc2U7XG4gIGlmICghdG9rZW4pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gdG9rZW47XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Q29va2llID0gKGtleTogc3RyaW5nLCBjb250ZXh0PzogYW55KSA9PiB7XG4gIHJldHVybiBpc0Jyb3dzZXJcbiAgICA/IGdldENvb2tpZUZyb21Ccm93c2VyKGtleSlcbiAgICA6IGdldENvb2tpZUZyb21TZXJ2ZXIoY29udGV4dCwga2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZXRDb29raWUgPSAoa2V5OiBzdHJpbmcsIHRva2VuOiBhbnkpID0+IHtcbiAgY29va2llLnNldChrZXksIHRva2VuLCB7IGV4cGlyZXM6IDcgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlQ29va2llID0gKGtleTogc3RyaW5nKSA9PiB7XG4gIGNvb2tpZS5yZW1vdmUoa2V5KTtcbn07XG4iXSwibmFtZXMiOlsiY29va2llIiwibmV4dENvb2tpZSIsImlzQnJvd3NlciIsImdldENvb2tpZUZyb21Ccm93c2VyIiwia2V5IiwiZ2V0IiwiZ2V0Q29va2llRnJvbVNlcnZlciIsImN0eCIsInRva2VuIiwiZ2V0Q29va2llIiwiY29udGV4dCIsInNldENvb2tpZSIsInNldCIsImV4cGlyZXMiLCJyZW1vdmVDb29raWUiLCJyZW1vdmUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./utils/session.ts\n");

/***/ }),

/***/ "@emotion/cache":
/*!*********************************!*\
  !*** external "@emotion/cache" ***!
  \*********************************/
/***/ ((module) => {

module.exports = import("@emotion/cache");;

/***/ }),

/***/ "@emotion/server/create-instance":
/*!**************************************************!*\
  !*** external "@emotion/server/create-instance" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = import("@emotion/server/create-instance");;

/***/ }),

/***/ "js-cookie":
/*!****************************!*\
  !*** external "js-cookie" ***!
  \****************************/
/***/ ((module) => {

module.exports = import("js-cookie");;

/***/ }),

/***/ "next-cookies":
/*!*******************************!*\
  !*** external "next-cookies" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("next-cookies");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "stylis":
/*!*************************!*\
  !*** external "stylis" ***!
  \*************************/
/***/ ((module) => {

module.exports = import("stylis");;

/***/ }),

/***/ "stylis-plugin-rtl":
/*!************************************!*\
  !*** external "stylis-plugin-rtl" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("stylis-plugin-rtl");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_document.tsx")));
module.exports = __webpack_exports__;

})();