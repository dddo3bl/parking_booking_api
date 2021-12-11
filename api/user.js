const express = require('express');
const router = express.Router();
const db = require('./db_config');


router.get('/',(req,res)=>{
    res.status(200).json({
        message:"ok"
    });
});

router.post('/singup', (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const usertype = req.body.usertype;
    db.query('SELECT * from users WHERE email = ? ',[email],(error, result)=>{
        if(error){
            console.log('error is:'+error);
            res.status(404).json({
                message:"error",
                error:error
            });
        }else{
// ================== if is exsist return the email or phone number alredy exsit
            if(result.length != 0){
                res.status(404).json({
                    message:"the email or phone number alredy exsit"
                });
            }else{
// ================== if dosnt exsist return add it
                db.query('INSERT INTO users(user_name, email, password, user_type) VALUES( ?, ?, ?, ?)',[name, email, password,usertype],(error,result)=>{
                    if(error){
                        res.status(405).json({
                            message:error
                        });
                    }else{
                        res.status(200).json({
                            message:"add it",
                            result:result
                        });
                    }
                })
            }
        }
    })
});


router.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    db.query('SELECT * FROM users WHERE email = ? ',
    [email],
    (error, result)=>{
        if(error){
            console.log(error);
            res.json({
                error:error
            }).status(404);
        }else{
            if(result == 0){
                console.log("not found");
                res.status(404).json({
                    message:"not found",
                })
            }else{
                console.log("ok");
                console.log(result[0]['password']);
                if(result[0]['password'] === password){
                    console.log("the same");
                    res.status(200).json({
                        result:result
                    });
                }else{
                    console.log("not same");
                    res.status(402).json({
                        message:"password wrong"
                    })
                }
            }
        }
    }
    )
});

router.get('/city',(req,res)=>{
    db.query('SELECT * FROM cities',(error,result)=>{
        if(error){
            res.status(404).json({
                error:error
            });
        }else{
            res.status(200).json({
                result:result
            });
        }
    })
});


router.post('/area',(req,res)=>{
    const city = req.body.city;
  
    db.query('SELECT * FROM areas WHERE city_id = ?',[city],(error,result)=>{
        if(error){
            
            res.status(404).json({
                message:error
            });
        }else{
            res.status(200).json({
                result
            });
        }
    }) ;
});


router.post('/addparking',(req,res)=>{
    const id = req.body.id;
    const parkingname = req.body.parkingname;
    const cityid = req.body.cityid;
    const area = req.body.area;
    const parkingnum = req.body.parkingnum;
    const price = req.body.price;
    console.log(parkingnum);
    const desc = req.body.descrition
    db.query('INSERT INTO parkin_no(user_id ,parking_name, parking_description, area_id) VALUES( ?, ?, ?, ?)',
    [
        id, parkingname, desc, area
    ],
    (error,result)=>{
        if(error){
            res.status(404).json({
                message:error
            });
        }else{
            
            const parkingId = result['insertId'];
            parkingnum + 1;
            console.log(parkingnum);
            for(i = 0; i < parkingnum ; i++){
                
                db.query('INSERT INTO parking_num(parking_index, parking_id, price_of_parking) VALUES(?, ?,?)',[i, parkingId, price]);
                console.log(i);
            }
            res.status(200).json({
                message:"inserted secss"
            });
            
        }
    });
});


router.post('/tttt',(req,res)=>{
    const id = req.body.id;
    const parkingname = req.body.parkingname;
    const cityid = req.body.cityid;
    const area = req.body.area;
    const parkingnum = req.body.parkingnum;
    const desc = req.body.descrition;
    for(i = 1; i < parkingnum+1; i++){
        db.query('INSERT INTO parking_num(parking_index, parking_id) VALUES(?, ?)',[i, 1]);
    }
    res.status(200).json({
        message:"ok"
    });
})

module.exports = router ;