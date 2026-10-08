class SuccessResponse {
    constructor({message, status = 200, metadata = {} }) {
        this.message = message;
        this.status = status;
        this.metadata = metadata;
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({message, metadata})
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, metadata }) {
        super({message, status: 201, metadata})
    }
}

module.exports = { OK, CREATED };