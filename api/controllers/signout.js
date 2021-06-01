async function signout(req, res) {
    req.session.destroy();
    console.log("session ended")
    res.status(200).json({message: "susscessfuly signout of session"})
}

module.exports = {
    signout
}