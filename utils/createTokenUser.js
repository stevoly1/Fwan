

exports.createTokenUser = async (user) => {
  return {userId: user._id, userType: user.userType };
}