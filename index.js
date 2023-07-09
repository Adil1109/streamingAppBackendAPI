const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require('./routers/authRouter');
const postsRouter = require('./routers/postsRouter');

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {})
	.catch((err) => {
		throw new Error();
	});

app.get('/', (req, res) => {
	res.status(200).json({ message: 'hello' });
});

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);

app.get('*', (req, res) => {
	res.status(404).json({ success: false, message: 'Page not found!' });
});

app.listen(process.env.PORT, () => {});
