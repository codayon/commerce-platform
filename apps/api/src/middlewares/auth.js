const protect = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in",
    });
  }

  next();
};

export { protect };
