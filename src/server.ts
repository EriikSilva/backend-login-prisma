import express, { NextFunction, Request, Response } from 'express';
import routes from './routes';
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors())
app.use(routes);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});
app.listen(3000, () => {
  console.log('Servidor iniciado em http://localhost:3000');
});
