
class businessOwnerHandler{
    constructor(){}
    async login(req, res){
        return res.status(200).send({status:true, msg:"sucess"})
    }
}

module.exports = businessOwnerHandler;