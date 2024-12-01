import express, { Application } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import { globalErrorhandler } from './app/middlewares/globalErrorhandler';
import router from './app/routes';
const app: Application = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1', router)

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
    });
});

app.use(globalErrorhandler);
app.use(notFound)

export default app;
