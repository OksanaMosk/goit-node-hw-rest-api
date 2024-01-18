const validateSubscription = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(422).json({
        message:
          "missing field 'subscription' or must be one subscription of [starter, pro, business]",
      });
    }
    next();
  };
  return func;
};

module.exports = validateSubscription;
