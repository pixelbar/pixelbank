define("test", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function test() {
        console.log("Hi from test!");
    }
    exports.test = test;
});
define("index", ["require", "exports", "test"], function (require, exports, test_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    test_1.test();
});
