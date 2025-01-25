"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firebaseConfig = {
    apiKey: "AIzaSyDYdEjNqRULS_W0926owilWh2pP2x_bUxk",
    authDomain: "maithetuan-20211010.firebaseapp.com",
    projectId: "maithetuan-20211010",
    storageBucket: "maithetuan-20211010.firebasestorage.app",
    messagingSenderId: "435921427887",
    appId: "1:435921427887:web:b06070ed551bb244d2a35a",
    measurementId: "G-Q0EX51YDGG"
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.auth = (0, auth_1.getAuth)(app);
//# sourceMappingURL=firebase-config.js.map