const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const generalHelper = require('./helpers/general.helper');
const routes = require('./routes');
global.appConfig = require('./config/config');
global.appError = require('./config/errors');
global.appEnum = require('./config/enum');

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

    app.get('/', (req, res) => res.status(200).send(`${appConfig.app.name} v${appConfig.app.version}`));
    app.use('/v1', routes);

    app.listen(appConfig.app.port, () => {
        console.log(`Server running on port ${appConfig.app.port}`);
    });
};

const connectDb = () => {
    mongoose.Promise = global.Promise;

    mongoose.connect(appConfig.db.url, {
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