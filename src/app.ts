import express, { Express, Request, Response, NextFunction } from 'express';
import nunjucks from 'nunjucks';
import ErrorHandler from './middleware/error';
import cookieParser from 'cookie-parser';

const app: Express = express();

app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use(express.static('src/public'));
app.use(express.urlencoded({ extended: true }));

// Configure Nunjucks
nunjucks.configure('src/views', {
    autoescape: true,
    express: app
});

// Set view engine to Nunjucks
app.set('view engine', 'njk');

// Importing routes
import userRoutes from './routes/userRoutes';
import ssoRoutes from './routes/ssoRoutes';
import tscsRoutes from './routes/tscsRoutes';
import otpRoutes from './routes/otpRoutes';
import offerRoutes from './routes/offerRoutes';
import tradeRoutes from './routes/tradeRoutes';
import rateRoutes from './routes/rateRoute';
import discussionRoutes from './routes/discussionRoutes';
import chatRoutes from './routes/chatRoutes';
import tradeHistoryRoute from './routes/tradeshistoryRoutes';
import ratingsRoute from './routes/ratingsRoute'; 

// Use routes
app.use(userRoutes);
app.use(ssoRoutes);
app.use(tscsRoutes);
app.use(otpRoutes);
app.use(offerRoutes);
app.use(tradeRoutes);
app.use(rateRoutes);
app.use(discussionRoutes);
app.use(chatRoutes);
app.use(tradeHistoryRoute);
app.use(ratingsRoute); 

app.use(ErrorHandler);

export default app;
