// verify the token token
import jwt from 'jsonwebtoken';

export default function verify(req,res,next){
    try{
        const token=req.header('x-auth-token');
        // console.log('verifying token',token);
        try{
            const dec_token=jwt.verify(token,process.env.PRIVATE_KEY);
            req.id=dec_token.id;
            //req of next,uname not in params
            next();
        }   
        catch(e){
            res.status(401).send('Invalid token');
        }
    }
    catch(err){
        res.status(400).send(err);
    }
}