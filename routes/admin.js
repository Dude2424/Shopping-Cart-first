const { response } = require('express');
var express = require('express');

const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin/login')
  }
}
/* GET users listing. */
router.get('/',verifyLogin, function (req, res) {
  let user = req.session.admin

  productHelper.getAllProducts().then((product) => {
    console.log(product)
    res.render('admin/view-products', { admin: true, product,user });
  })
});
router.get('/add-product',function(req,res){
  res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{
  
  

 productHelpers.addproduct(req.body,(id)=>{
   let image=req.files.image
   
   console.log(req.files)
   image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
     if(!err){
      res.render("admin/add-product")
     }else{
       console.log(err);
     }
   })
   
 })
})
router.get('/delete-product/:id',(req,res)=>{
     let proId=req.params.id
     console.log(proId);
     productHelpers.deleteProduct(proId).then((response)=>{
       res.redirect('/admin')
     })
})

router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  console.log(req.params.id);
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.image){
      let image=req.files.image
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
})
router.get('/login', (req, res) => {
  if (req.session.admin) {
    res.redirect('/admin/')
  } else
    res.render('admin/login', { "loginErr": req.session.userLoginErr })
  req.session.userLoginErr = false
})
router.post('/login', (req, res) => {
  productHelpers.adminLogin(req.body) 
  .then((response) => {
    if (response.status) {
      req.session.admin = response.admin
      req.session.admin.loggedIn = true
      res.redirect('/admin/')
    } else {
      req.session.userLoginErr = true
      res.redirect('/admin/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.admin=null
  res.redirect('/admin/')
})
router.get("/allorder",verifyLogin, async (req, res) => {
  let orders = await productHelpers.getOrderDetails();
  res.render("admin/order-manager", { admin: true, orders });
});
router.get("/alluser",verifyLogin, (req, res) => {
  productHelpers.getAllUsers().then((users) => {
    console.log(users);
    res.render("admin/allusers", { admin: true, users });
  });
});


module.exports = router;
