"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCorsHeaders = setCorsHeaders;
const ALLOWED_ORIGINS = [
    'https://quranastroweb.vercel.app',
    'http://localhost:4321',
    'http://localhost:3000'
];
function setCorsHeaders(req, res) {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
}
