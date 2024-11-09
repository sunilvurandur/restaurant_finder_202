//Root routes file

module.exports = (app, router)=>{
    router.post('/login',(req, res)=>{
        try {
            return res.send({status: true, "msg":"login sucessful"})
        } catch (error) {
            console.log(error);
            return res.status(500).send({status:false, msg:"Internal server Error"})
        }
    })

    router.post('/register', (req, res)=>{
        try {
            //validating request

            //inserting record

            //returning response
        } catch (error) {
            return res.status(500).send({statu:false, msg:"Internal Server Error"})
        }
    })
}