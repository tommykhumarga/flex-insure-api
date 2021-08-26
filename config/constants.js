module.exports = {
    dbDateFormat: 'YYYY-MM-DD',
    dbDateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
    dateTimeFormat: 'DD-MM-YYYY HH:mm:ss',
    dateFormat: 'DD-MM-YYYY',
    userTypes: {
        none: {
            value: 'none',
            label: 'None'
        },
        prime: {
            value: 'prime',
            label: 'Prime'
        },
        insurance: {
            value: 'insurance',
            label: 'Insurance'
        },
        intermediaries: {
            value: 'intermediaries',
            label: 'Intermediaries'
        }
    },
    userAuth: {
        low: {
            value: 'low',
            label: 'Login'
        },
        medium: {
            value: 'medium',
            label: 'Email and SMS OTP'
        },
        high: {
            value: 'high',
            label: 'Email, SMS OTP and Face Recognition'
        }
    }
};