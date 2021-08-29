const Enum = require('enum');

exports.dateFormat = new Enum({
    dbDateFormat: 'YYYY-MM-DD',
    dbDateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
    appDateFormat: 'DD-MM-YYYY',
    appDateTimeFormat: 'DD-MM-YYYY HH:mm:ss'
});

exports.userType = new Enum({
    none: 'None',
    prime: 'Prime',
    insurance: 'Insurance',
    intermediaries: 'Intermediaries',
    endUser: 'End User'
});

exports.userAuth = new Enum({
    low: 'Login'
});

exports.productType = new Enum({
    carInsurance: 'Car Insurance',
    motorcycleInsurance: 'Motorcycle Insurance'
});