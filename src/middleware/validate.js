/**
 * Middleware to validate request payload against a Zod schema
 * @param {import('zod').ZodSchema} schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    // Map Zod errors into a clean, developer-friendly list
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.').replace(/^body\./, ''),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: formattedErrors,
    });
  }
};
