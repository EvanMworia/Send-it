import Joi from 'joi';

// List of allowed major towns
const majorTowns = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
    'Thika', 'Malindi', 'Kitale', 'Garissa', 'Nyeri'
];

// Parcel Schema
const parcelSchema = Joi.object({
    senderId: Joi.string().uuid().required().messages({
        'string.empty': 'Sender ID is required.',
        'string.guid': 'Sender ID must be a valid UUID.',
    }),
    receiverId: Joi.string().uuid().required().messages({
        'string.empty': 'Receiver ID is required.',
        'string.guid': 'Receiver ID must be a valid UUID.',
    }),
    sendingLocation: Joi.string().valid(...majorTowns).required().messages({
        'any.only': `Sending location must be one of: ${majorTowns.join(', ')}.`,
        'string.empty': 'Sending location is required.'
    }),
    pickupLocation: Joi.string().valid(...majorTowns).required().messages({
        'any.only': `Pickup location must be one of: ${majorTowns.join(', ')}.`,
        'string.empty': 'Pickup location is required.'
    }),
    status: Joi.string()
        .valid('Pending', 'In Transit', 'Delivered', 'Picked')
        .default('Pending')
        .messages({
            'any.only': 'Status must be one of Pending, In Transit, Delivered, or Picked.',
        }),
});

// Validate function
const validateParcel = (parcel) => parcelSchema.validate(parcel, { abortEarly: false });

export { validateParcel };



// Joi Schema for Validating Parcel Status
const statusSchema = Joi.object({
    parcelId: Joi.string().uuid().required().messages({
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