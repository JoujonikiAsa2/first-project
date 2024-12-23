import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
const app: Application = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({origin: ['http://localhost:5713']}));

app.use('/api/v1', router);

const test = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
};

// app.get('/', (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: 'Server is running',
//     });
// });

app.get('/', test);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
