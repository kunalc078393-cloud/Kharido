import express from 'express';
import morgon from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import categoryRouter from './routes/category.routes.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import orderRouter from './routes/order.routes.js';
import testRouter from './routes/test.routes.js';


const app = express();

app.use(express.json());
app.use(morgon('dev'));
app.use(cookieParser());
app.set("trust proxy", true);


app.use('/api/auth',authRouter);
app.use('/api/categories',categoryRouter);
app.use('/api/products',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/orders',orderRouter);
app.use('/api',testRouter);



export default app;