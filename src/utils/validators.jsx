import { SCHEMAS } from '../services/schema';

export const validateData = (data, schemaType) => {
  const schema = SCHEMAS[schemaType];
  const errors = {};

  Object.keys(schema).forEach(field => {
    const fieldSchema = schema[field];
    const value = data[field];

    // Check required fields
    if (fieldSchema.required && !value && value !== 0) {
      errors[field] = `${field} is required`;
      return;
    }

    // Type checking
    if (value) {
      switch (fieldSchema.type) {
        case 'number':
          if (typeof value !== 'number') {
            errors[field] = `${field} must be a number`;
          }
          if (fieldSchema.min !== undefined && value < fieldSchema.min) {
            errors[field] = `${field} must be at least ${fieldSchema.min}`;
          }
          if (fieldSchema.max !== undefined && value > fieldSchema.max) {
            errors[field] = `${field} must be at most ${fieldSchema.max}`;
          }
          break;
        case 'string':
          if (typeof value !== 'string') {
            errors[field] = `${field} must be a string`;
          }
          if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
            errors[field] = `${field} must be one of: ${fieldSchema.enum.join(', ')}`;
          }
          break;
        case 'array':
          if (!Array.isArray(value)) {
            errors[field] = `${field} must be an array`;
          }
          break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};