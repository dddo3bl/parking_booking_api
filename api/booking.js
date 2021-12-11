const express = require('express');
const router = express.Router();
const db = require('./db_config');


router.get('/getcity',(req,res)=>{
    db.query('SELECT * FROM cities',(error, result)=>{
        if(error){
            res.status(404).json({
                message:error
            });
        }else{
            res.status(200).json({
                result
            });
        }
    })
})


router.post('/selectparking',(req,res)=>{
    const areaId = req.body.areaId;
    const parkingId = req.body.parkingId;
    db.query('SELECT * from parkin_no WHERE area_id = ? ',[areaId],(error,result)=>{
        if(error){
            res.status(404).json({
                message:error
            });
        }else{
            res.status(200).json({
                result
            });
        }
    });
});

router.post('/newbooking',(req,res)=>{

    const startdate = req.body.startdate;
    const starttime = req.body.starttime;
    const enddate = req.body.enddate;
    const endtime = req.body.endtime;
    const parkingId = req.body.parkingId;
    console.log(parkingId)
    const fullstart = startdate + " " + starttime;
    const fullend = enddate + " " + endtime;
    var st = new Date(fullstart);
    const finalDatest = st.toISOString().split('T')[0]+' '+st.toTimeString().split(' ')[0];
    var en = new Date(fullend);
    const finalDateen = en.toISOString().split('T')[0]+' '+en.toTimeString().split(' ')[0];
    // console.log(st.getTime() - en.getTime())

function diff_hours(dt2, dt1) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
  
 }
const difrent = diff_hours(st, en);
                      db.query('SELECT parking_num.parking_num_id,parking_num.parking_index ,parkin_no.parkin_id, parking_num.price_of_parking FROM parkin_no, parking_num WHERE parkin_no.parkin_id = parking_num.parking_id AND parkin_no.parkin_id = ? AND parking_num.parking_num_id NOT IN (SELECT bokkings.index_id FROM bokkings WHERE bokkings.end_date = ? )',[parkingId,finalDateen],(error,result)=>{
                            if(error){
                                console.log("error");
                                res.status(400).json({
                                    message:error
                                });
                            }else{
                                console.log(result)
                                res.status(200).json({
                                    result
                                })
                            }
                            
                        })
                        // SELECT parking_num.parking_num_id,parking_num.parking_index ,parkin_no.parkin_id FROM parkin_no, parking_num WHERE parkin_no.parkin_id = parking_num.parking_id AND parking_num.parking_num_id NOT IN (SELECT bokkings.index_id FROM bokkings WHERE bokkings.end_date = "2021-09-15 09:47:08")
});


router.post('/savebooking',(req,res)=>{
    // type format = (date: Date, format?: string, i18n?: I18nSettings) => str;
    const startdate = req.body.startdate;
    const starttime = req.body.starttime;
    const enddate = req.body.enddate;
    const endtime = req.body.endtime;
    const parkingId = req.body.parkingId;
    const parkingIndexId = req.body.parkingIndexId;
    const fullstart = startdate + " " + starttime;
    const fullend = enddate + " " + endtime;
    var st = new Date(fullstart);
    finalDatest = st.toISOString().split('T')[0]+' '+st.toTimeString().split(' ')[0];
var en = new Date(fullend);
finalDateen = en.toISOString().split('T')[0]+' '+en.toTimeString().split(' ')[0];
});

router.post('/price',(req,res)=>{
    const startdate = req.body.startdate;
    const starttime = req.body.starttime;
    const enddate = req.body.enddate;
    const endtime = req.body.endtime;
    const porkingid = req.body.parkingId;


    const fullstart = startdate + " " + starttime;
    const fullend = enddate + " " + endtime;

    var st = new Date(fullstart);
    finalDatest = st.toISOString().split('T')[0]+' '+st.toTimeString().split(' ')[0];
    console.log(finalDatest);
var en = new Date(fullend);
finalDateen = en.toISOString().split('T')[0]+' '+en.toTimeString().split(' ')[0];
function diff_hours(dt2, dt1) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
  
 }
const difrent = diff_hours(st, en);
db.query('SELECT price_of_parking FROM parking_num WHERE parking_id = ?',[porkingid],(error,result)=>{
    if(error){
        res.status(404).json({
            message:error
        });
    }
    const priceofpark = result[0]['price_of_parking'];
    const finalprice =  priceofpark*difrent
    res.status(200).json({
        message:"ok",
        difrent:difrent,
        finalprice:finalprice,
        finalDateen:finalDateen,
        finalDatest:finalDatest
    });
});
});

const tt = router.post('/confirmBoking',(req,res)=>{
    const userId = req.body.userId;
    const parkingIndex = req.body.parkingIndex;
    const parkingId = req.body.parkingId;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
    const totalprice = req.body.totalprice;
    const totalhours = req.body.totalhours;

    db.query("INSERT INTO `bokkings` (`bokkings`, `start_date`, `end_date`, `index_id`, `userid`, `totalhours`, `totalprice`) VALUES (NULL, ?, ?, ?, ?, ?, ?)",[startdate,enddate,parkingId,userId,totalhours,totalprice],(error,row)=>{
        if(error){
            res.status(400).json({
                message:error,
                done:"not done"
            });
        }
        res.status(200).json({
            message:"message",
            done:"done"
        });
    });
});


router.post('/userbookings',(req,res)=>{
    const userId = req.body.userId;
    console.log(userId);

    db.query('SELECT * FROM bokkings WHERE userid = ?',[userId],(error,result)=>{
        if(error){
            res.status(400).json({
                error
            });
        }else{
            res.status(200).json({
                result
            });
        }
    });
});


router.post('/cancelbooking',(req,res)=>{
    const userId = req.body.userId;
    const bookingnum = req.body.bookingnum;
    console.log(bookingnum)
    db.query('DELETE FROM bokkings WHERE bokkings = ?',[bookingnum],(error,result)=>{
        if(error){
            console.log("error");
            res.status(400).json({
                error
            });
        }else{
            console.log("ok");
            res.status(200).json({
                message:"ok"
            });
        }
    })
});

router.post('/getpersonalinfo',(req,res)=>{
    const userId = req.body.userId;

    console.log(userId);

    db.query('SELECT * FROM users WHERE user_id = ?',[userId],(error,row)=>{
        if(error){
            res.status(400).json({
                message:error
            })
        }else{
            res.status(200).json({
                row
            });
        }
    })
})

router.post('/upDateInfo',(req,res)=>{
    const userId = req.body.userId;
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    console.log(email);
    console.log(password);
    console.log(username);

    db.query('UPDATE users SET user_name = ?, email = ?, password = ? WHERE user_id = ?',[username,email,password, userId],(error,result)=>{
        if(error){
            console.log(error);
            res.status(400).json({
                error
            });
        }else{
            res.status(200).json({
                message:"ok"
            });
        }
    }) 
})

router.post('/getBookingsList',(req,res)=>{
    const userid = req.body.userId;
    console.log(userid);

    db.query('SELECT parkin_no.user_id , parking_num.parking_id ,parking_num.parking_num_id, bokkings.index_id,bokkings.start_date, bokkings.end_date, bokkings.totalhours, bokkings.totalprice from bokkings,parking_num, parkin_no WHERE parkin_no.parkin_id = parking_num.parking_id AND parking_num.parking_num_id = bokkings.index_id AND parkin_no.parkin_id = ?',[userid],(error,result)=>{
        if(error){
            console.log(error)
            res.status(400).json({
                error
            });
        }else{
            db.query('SELECT parkin_no.user_id , parking_num.parking_id ,parking_num.parking_num_id, bokkings.index_id,bokkings.start_date, bokkings.end_date, bokkings.totalhours,SUM(bokkings.totalprice), bokkings.totalprice from bokkings,parking_num, parkin_no WHERE parkin_no.parkin_id = parking_num.parking_id AND parking_num.parking_num_id = bokkings.index_id AND parkin_no.parkin_id = ?',[userid],(error,row)=>{
                if(error){
                    res.status(400).json({
                        error
                    })
                }else{
                    res.status(200).json({
                        result,
                        
                    });
                }
            })
        }
    })
    

})

module.exports = router ;