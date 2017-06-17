const ArticleModel = require('../models/article')
const AchiveController = require('./archive')

exports.query = async function (ctx) {
    const _query = ctx.request.query
    const result = await ArticleModel
            .find(_query)
            .populate('keywords')
            .sort('-meta.createAt')
            .lean()

    if (result.length === 0) {
        ctx.status = 404
        throw new Error('没找到！')
    }

    ctx.status = 200
    ctx.body = {
        success: true,
        data: result
    }
}

exports.del = async function (ctx) {
    const _id = ctx.params._id
    const result = await ArticleModel.findByIdAndRemove(_id)
    ctx.status = 200
    ctx.body = {
        success: true,
        data: result
    }
}

exports.create = async function(ctx) {
    const doc = ctx.request.body
    const _id = doc._id
    let result
    if (_id) {
        result = await ArticleModel.findByIdAndUpdate(_id, doc)
    } else {
        result = await ArticleModel.create(doc)
        const achive = await AchiveController.create(result)
        console.log(achive)
    }
    ctx.status = 200
    ctx.body = {
        success: true,
        data: result
    }
}