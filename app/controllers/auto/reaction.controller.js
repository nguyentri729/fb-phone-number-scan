const mongoose = require("mongoose");
const AutoReaction = mongoose.model("AutoReaction")
const helper = require("../../utils/helper")
const _ = require("lodash");
exports.create = async (req, res) =>  {
    const {accessToken, typeReaction, options} = req.body;
    const userInfo = await helper.getInfoToken(accessToken)
    if (!userInfo) {
        throw new Error("Vui lòng nhập accessToken hợp lệ")
    }

    console.log({userInfo});
    const newReactor = new AutoReaction({
        accessToken: accessToken,
        facebookID: _.get(userInfo, "id"),
        name: _.get(userInfo, "name", "Unkown"),
        typeReaction, 
        options, 
        status: {
            status: "active",
        },
        createdBy: helper.getObjectId(req.user)
    }).save()
    res.jsonp(newReactor)
}

exports.list = async(req, res) => {
    const reactors = await AutoReaction.find({
        createdBy: helper.getObjectId(req.user)
    }) 
    res.jsonp(reactors)
}

exports.read = async (req, res) => {
    const reactor = req.reactor
    res.jsonp(reactor)
}

exports.update = async (req, res) => {
    const {accessToken, typeReaction, options} = req.body;
    let reactor = req.reactor
    const userInfo = await helper.getInfoToken(accessToken)
    if (!userInfo) {
        throw new Error("Vui lòng nhập accessToken hợp lệ")
    }
    if (userInfo.id !== reactor.facebookID) {
        throw new Error("Có vẻ bạn điền nhập access token của một tài khoản khác. ")
    }
    reactor.accessToken = accessToken
    reactor.typeReaction = typeReaction
    reactor.options = options
    const result = await reactor.save()
    res.jsonp(result)    
}

exports.stop = async(req, res) => {
    let reactor = req.reactor
    let {msg} = req.body
    reactor.status = {
        status: "stop",
        msg
    }
    const result = reactor.save()
    res.jsonp(result)
}

exports.active = async(req, res) => {
    let reactor = req.reactor
    let {msg} = req.body
    reactor.status = {
        status: "active",
        msg
    }
    const result = reactor.save()
    res.jsonp(result)
}

exports.reactorById = (req, res, next, id) => {
    AutoReaction.findById(id).exec(function (err, reactor) {
        if (err) return next(err);
        if (!reactor) return next(new Error("Failed to load history " + id));
        req.reactor = reactor;
        next();
      });
}