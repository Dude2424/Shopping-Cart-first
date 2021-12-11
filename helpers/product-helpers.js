var db=require('../config/connection')
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectId
const { ObjectId } = require('bson')
const { response } = require('express')
module.exports={

    addproduct:(product,callback)=>{
        
        db.get().collection('product').insertOne(product).then((data)=>{
            
            callback(data.insertedId)
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Description,
                    Price:proDetails.Price,
                    category:proDetails.Category
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    adminLogin: (userData) => {
        console.log(userData,"userdata");

        let loginstatus = false
        let response = {}
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: userData.username })
            if (admin) {
                console.log(admin)
                db.get().collection(collection.ADMIN_COLLECTION).findOne({ Password: userData.Password }).then((status) => {
                    if (status) {
                        console.log('success');
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('failed');
                        resolve({ status: false })

                    }
                })
            } else {
                console.log('Failed');
                resolve({ status: false })
            }
        })
    },
    getOrderDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let orders= await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            resolve(orders)
        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users= await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    }

}