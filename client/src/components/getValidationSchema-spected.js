const MIN_PASSWORD_LENGTH = 8;

export default function getSpectedValidationSchema(values) {
    return {
        email: [
            [value => !isEmpty(value), 'Email is required.'],
            [value => isEmail(value), 'Email is not valid.'],
        ],
        password: [
            [value => !isEmpty(value), 'Password is required.'],
            [
                value => value.length >= MIN_PASSWORD_LENGTH,
                `Password has to be longer than ${MIN_PASSWORD_LENGTH} characters!`
            ],
        ],
        passwordConfirmation: [
            [value => !isEmpty(value), 'Password confirmation is required.'],
            [value => value === values.password, 'Passwords are not the same.'],
        ]
    };
}

function isEmpty(value) {
    return !value || !value.trim();
}

function isEmail(value) {
    const EMAIL_REGEXP = /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/;
    return EMAIL_REGEXP.test(value);
}