const Comments = require("../models/comments.model").model;

async function getCommentsByTicketId(id) {
    try {
        let comments = await Comments.find(
            {
                ticketId: id,
            }
        ).exec();

        return comments;
    } catch (error) {
        throw new Error(error);
    }
}

function deleteComment(params) {
    
}

module.exports = {
    getCommentsByTicketId,
    deleteComment,
}