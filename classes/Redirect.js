class Redirect {
    constructor(destination, reason) {
        this.destination = destination
        this.reason = reason
    }

    static redirect(destination, reason){
        return new Redirect(destination, reason)
    }
}

module.exports = Redirect