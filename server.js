//import modules 
//require
let express=require("express");
let cors=require("cors");
let mongodb=require("mongodb")
let bodyParser=require("body-parser")

//rest object
let app=express();

app.use(cors());

//MIME TYPE communnication language 
//between cet and server
//Json as MIME
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


let password=`admin`;
let db_name=`mern-db`;
let collection_name=`employees`
let db_url=`mongodb+srv://admin:${password}@cluster0.x0us0.mongodb.net/${db_name}?retryWrites=true&w=majority`

//Mongodb follow client server architecre
let mernClient=mongodb.MongoClient;

//GET Request
//arg1- Url pattern
//arg2- CallBack Function
app.get("/employees",(req,res) =>{

    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
            else{
                //throw client object
                //database instance
               let db= client.db(db_name);
               db.collection(collection_name).find().toArray((err,arr)=>{
                 if(err) throw err;
                 else{
                    // res.send(JSON.stringify(arr));
                     res.send(arr);
                 }
               })
            }
        })
});


app.post("/newemployee",(req,res) =>{
    //Data coming from react js
    // So req.body
    //JSON obj based on client data
    let obj={
        "id":req.body.id,
         "fullName":req.body.fullName,
         "email":req.body.email,
         "mobile":req.body.mobile,
         "city":req.body.city,
         "gender":req.body.gender,
         "departmentId":req.body.departmentId,
         "hireDate":req.body.hireDate,
         "isPermanent":req.body.isPermanent,

    }; 
    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
        else{
            let db=client.db(db_name);
            db.collection(collection_name).insertOne(obj,(err,result)=>{
                if(err) throw err;
                else{
                    res.send({insert:"Sucess"});
                }
            })
        }
    })
});

//Update mobile,email,city based on ID
app.put("/updateemployee",(req,res)=>{
    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
        else{
            let db=client.db(db_name);
            //JSON -1 --> VALUE TO CHANGE on ID
            //JSON 2 - -->SET THE VALUE USINF $SET OPERATOR
            db.collection(collection_name).updateOne({"id":req.body.id},{$set:{"mobile":req.body.mobile,
                                                                                "email":req.body.email,
                                                                                "city":req.body.city
                                                                                }},(err,result)=>{
                                                                                    if(err) throw err;
                                                                                    else{
                                                                                        res.send({update:"Sucess"});
                                                                                    }
                                                                                });
        } 
    })
});



//Delete Request
//BASED ON ID
app.delete("/deleteemployee",(req,res)=>{
    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
        else{
            let db=client.db(db_name);
            db.collection(collection_name).deleteOne({"id":req.body.id},(err,result)=>{
                if(err) throw error;
                else{
                res.send({delete:"Sucessful"});
                }
            })
            
            
        }
    })
})





//Assign the port
// these port no are assigned from live server
// if fails then we use 8080
let port=process.env.PORT || 8080;

app.listen(port,()=>{
    console.log("App started")
})



//Services

// http://localhost:8080/employees    GET
// http://localhost:8080/newemployee  POST
// http://localhost:8080/updateemployee PUT
// http://localhost:8080/deleteemployee  DELETE