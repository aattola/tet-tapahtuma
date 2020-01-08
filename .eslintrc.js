module.exports = {
    parser: "babel-eslint",
    "env": {
        "browser": true,
        "node": true
    },
    "extends": ["standard-react", "prettier-standard"],
    "parserOptions": {
        // "ecmaFeatures": {
        //     "experimentalObjectRestSpread": true,
        //     "jsx": true
        // },
        "sourceType": "module",
        "ecmaVersion": 8,
        // allowImportExportEverywhere: true
    },
    "plugins": [
        "react",
        "react-hooks"
    ],
    "rules": {
        "experimentalDecorators": [0],
        "react/jsx-no-bind": [0, {allowBind: true, allowFunctions: true, allowArrowFunctions: true}],
        "react/prop-types": [0],
        "react/no-string-refs": "error",
        "react/jsx-no-bind": "error",
        "indent": [
            "error",
            2
        ],
        "no-global-assign": [0],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "react/display-name": 1,
        "react/no-array-index-key": 0,
        "react/react-in-jsx-scope": 0,
        "react/prefer-stateless-function": 0,
        "react/forbid-prop-types": 0,
        "react/no-unescaped-entities": 0,
        "react/require-default-props": 0,
        "react/jsx-closing-bracket-location": 0,
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "eqeqeq": 0,
        "linebreak-style": 0
    }
};
