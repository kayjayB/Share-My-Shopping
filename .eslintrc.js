module.exports = {
    "env": {
        "es6": true,
    },
    "parserOptions": {
        "ecmaVersion": 7,
        "sourceType": "module"
    },
    "plugins": [
        "tape"
    ],
    "rules": {
        "tape/assertion-message": ["off", "always"],
        "tape/max-asserts": ["off", 5],
        "tape/no-identical-title": "error",
        "tape/no-ignored-test-files": "error",
        "tape/no-only-test": "error",
        "tape/no-skip-assert": "error",
        "tape/no-skip-test": "error",
        "tape/no-statement-after-end": "error",
        "tape/no-unknown-modifiers": "error",
        "tape/test-ended": "off",
        "tape/test-title": ["error", "if-multiple"],
        "tape/use-t-well": "error",
        "tape/use-t": "error",
        "tape/use-test": "error",
    }
};