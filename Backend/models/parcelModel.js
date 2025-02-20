import Joi from 'joi';

// List of allowed major towns
const majorTowns = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
    'Thika', 'Mwingi', 'Kitale', 'Garissa', 'Nyeri'
];

// Parcel Schema
const parcelSchema = Joi.object({
    senderEmail: Joi.string().email().required().messages({
        'string.empty': 'Sender email is required.',
        'string.email': 'Sender email must be a valid email address.',
    }),
    senderPhone: Joi.string().pattern(/^\+?[0-9]{7,15}$/).required().messages({
        'string.empty': 'Sender phone number is required.',
        'string.pattern.base': 'Sender phone must be a valid phone number.',
    }),
    receiverEmail: Joi.string().email().required().messages({
        'string.empty': 'Receiver email is required.',
        'string.email': 'Receiver email must be a valid email address.',
    }),
    receiverPhone: Joi.string().pattern(/^\+?[0-9]{7,15}$/).required().messages({
        'string.empty': 'Receiver phone number is required.',
        'string.pattern.base': 'Receiver phone must be a valid phone number.',
    }),
    SendingLocation: Joi.string().valid(...majorTowns).required().messages({
        'any.only': `Sending location must be one of: ${majorTowns.join(', ')}.`,
        'string.empty': 'Sending location is required.'
    }),
    PickupLocation: Joi.string().valid(...majorTowns).required().messages({
        'any.only': `Pickup location must be one of: ${majorTowns.join(', ')}.`,
        'string.empty': 'Pickup location is required.'
    }),
    status: Joi.string()
        .valid('Pending', 'In Transit', 'Delivered', 'Picked')
        .default('Pending')
        .messages({
            'any.only': 'Status must be one of Pending, In Transit, Delivered, or Picked.',
        }),
    price: Joi.number().positive().required().messages({
        'number.base': 'Price must be a number.',
        'number.positive': 'Price must be greater than zero.',
    }),
    sessionId: Joi.string().required().messages({
        'string.empty': 'Stripe session ID is required.',
    }),
});


// Validate function
const validateParcel = (parcel) => parcelSchema.validate(parcel, { abortEarly: false });

export { validateParcel };



// Joi Schema for Validating Parcel Status
const statusSchema = Joi.object({
    parcelId: Joi.required().messages({
        "string.empty": "Parcel ID is required.",
        "string.guid": "Parcel ID must be a valid UUID.",
    }),
    status: Joi.string()
        .valid("Pending", "In Transit", "Delivered", "Picked")
        .required()
        .messages({
            "any.only": "Status must be one of Pending, In Transit, Delivered, or Picked.",
        }),
});

const validateStatus = (status) => statusSchema.validate(status, { abortEarly: false });

export { validateStatus };


const deleteSchema = Joi.object({
    parcelId: Joi.string().uuid().required().messages({
        "string.empty": "Parcel ID is required.",
        "string.guid": "Parcel ID must be a valid UUID.",
    }),
});

const validateDelete = (parcel) => deleteSchema.validate(parcel, { abortEarly: false });
export { validateDelete };