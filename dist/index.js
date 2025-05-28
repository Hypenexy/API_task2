"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { configureRouting } from './routes';
const app = (0, express_1.default)();
app.use(express_1.default.json());
var items = [
    { id: 0, name: 'contentId' },
    { id: 1, name: 'modifiedBy' }
];
// API
// Endpoints from Task 3.
// I need to complete the tasks in reverse order, as to know what endpoints I need to create.
app.get('/items', (req, res) => {
    res.send('Hello World!');
});
app.post('/items', (req, res) => {
    res.send('Got a POST request');
});
// Validation middleware
function validateItemId(req, res, next) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 0) {
        res.status(400).json({ error: 'Invalid item ID' });
    }
    else {
        next();
    }
}
// Items API
app.get('/items/:id', validateItemId, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = items.find(item => item.id === id);
    if (item) {
        res.json(item);
    }
    else {
        res.status(404).json({ error: 'Item not found' });
    }
});
app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user');
});
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
