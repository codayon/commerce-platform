const getProfile = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "You are logged in" });
  } catch (err) {
    res.status(401).json({ success: false, message: "You are not logged in" });
  }
};

export { getProfile };
