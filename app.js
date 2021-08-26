const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const config = require('./config/config');
const generalHelper = require('./helpers/general.helper');
const routes = require('./routes');
global.fiErrors = require('./config/errors');

const main = async () => {
    const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(express.urlencoded({
        extended: true
    }));

    app.use(express.json({
        limit: '50mb',
        extended: true
    }));

    app.get('/', (req, res) => res.status(200).send(`${config.app.name} v${config.app.version}`));
    app.use('/v1', routes);

    app.listen(config.app.port, () => {
        console.log(`Server running on port ${config.app.port}`);
    });
};

const connectDb = () => {
    mongoose.Promise = global.Promise;

    mongoose.connect(config.db.url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log('Connected to Database');
        })
        .catch((err) => {
            generalHelper.saveErrorLog(err);
            console.log(err);
            process.exit();
        });
};

main()
    .then(() => {
        connectDb();
    })
    .catch((err) => {
        generalHelper.saveErrorLog(err);
        console.log(err);
        process.exit();
    });