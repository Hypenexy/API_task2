import express, { Request, Response, NextFunction } from 'express';
// import { configureRouting } from './routes';

const app = express();

app.use(express.json());

// configureRouting(app);


// In-memory data store

interface EnumServiceItem {
    id: number; name: string
}

interface EnumServiceItems extends Array<EnumServiceItem>{}

var items: EnumServiceItem[] = [
    { id: 0, name: 'contentId' },
    { id: 1, name: 'modifiedBy' }
];

// API

// Endpoints from Task 3.
// I need to complete the tasks in reverse order, as to know what endpoints I need to create.

app.get('/items', (req: Request, res: Response) => {
    res.status(200).json(items);
});

app.post('/items', (req: Request, res: Response) => {
    const { name } = req.body;
    if (typeof name !== 'string' || !name.trim()) {
        res.status(400).json({ error: 'Invalid or missing name' });
        return;
    }
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 0;
    const newItem: EnumServiceItem = { id: newId, name };
    items.push(newItem);
    res.status(201).json(newItem);
});

// Validation middleware

function validateItemId(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id < 0) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
    } else {
        next();
    }
}

// Items API

app.get('/items/:id', validateItemId, (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const item = items.find(item => item.id === id);
    if (item) {
        res.status(200).json(item);
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});

app.put('/items/:id', validateItemId, (req: Request, res: Response): void => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
        res.status(400).json({ error: 'Invalid or missing name' });
        return;
    }

    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
        res.status(404).json({ error: 'Item not found' });
        return;
    }

    items[itemIndex].name = name;
    res.status(200).json(items[itemIndex]);
});

app.delete('/items/:id', validateItemId, (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
        res.status(404).json({ error: 'Item not found' });
        return;
    }

    items.splice(itemIndex, 1);
    res.status(204).send();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})