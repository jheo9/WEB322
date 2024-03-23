/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Jaehyuk Heo Student ID: 105421234 Date: 2024-03-22
*
*  Published URL: https://cute-red-pike-hose.cyclic.app
********************************************************************************/



const legoData = require("./modules/legoSets");
const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// app.use((req, res, next) => {
//   res.setHeader('X-Content-Type-Options', 'nosniff');
//   next();
// });


app.get('/', (req, res) => {
  res.render("home")
});

app.get('/about', (req, res) => {
  res.render("about");
});

// app.get("/lego/sets", async (req,res)=>{

//   let sets = [];

//   try{    
//     if(req.query.theme){
//       sets = await legoData.getSetsByTheme(req.query.theme);
//     }else{
//       sets = await legoData.getAllSets();
//     }

//     res.render("sets", {sets})
//   }catch(err){
//     res.status(404).render("404", {message: err});
//   }
  
// });

app.get("/lego/addSet", async (req,res)=>{
  let themes = await legoData.getAllThemes()
  res.render("addSet", { themes: themes })
});

app.post("/lego/addSet", async (req, res)=>{
try{
  await legoData.addSet(req.body);
  res.redirect("/lego/sets");
}
catch(err)
{
  res.status(500).render("500", {message: `Error: ${err}`});
}
});

app.get("/lego/editSet/:num", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum(req.params.num);
    let themes = await legoData.getAllThemes();
    res.render("editSet", {set, themes});
  }catch(err){
    res.status(404).render("404", {message: err});
  }
});

app.post("/lego/editSet", async (req, res)=>{
try{
await legoData.editSet(req.body.set_num, req.body);
res.redirect("/lego/sets");
}catch(err){
res.status(500).render("500",{message: `Error 500 ${err}`});
}
});

app.get("/lego/deleteSet/:num", async (req, res)=>{
try{
await legoData.deleteSet(req.params.num);
res.redirect("/lego/sets");
}catch(err){
res.status(500).render("500", {message: `Error ${err}`});
}
});

app.get("/lego/sets", async (req, res)=>{
let sets = [];

try{
if(req.query.theme){
  sets =await legoData.getSetsByTheme(req.query.theme)
}
else{
  sets = await legoData.getAllSets();
}
res.render("sets", {sets})
}catch(err){
  res.status(404).render("404", {message: `Error ${err}`});
}
});

app.get("/lego/sets/:num", async (req, res)=>{
try{
let set = await legoData.getSetByNum(req.params.num);
res.render("set", { set });
}catch(err){
res.status(404).render("404", {message: `Error ${err}`});
}
});


app.use((req, res, next) => {
  
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});

legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
}).catch(err => {
  console.log(err);
})

// const Sequelize = require('sequelize');

// // set up sequelize to point to our postgres database
// const sequelize = new Sequelize('neondb', 'neondb_owner', 'LN3kUM6AFTru', {
//   host: 'ep-empty-paper-a5jcsq0m.us-east-2.aws.neon.tech',
//   dialect: 'postgres',
//   port: 5432,
//   dialectOptions: {
//     ssl: { rejectUnauthorized: false },
//   },
// });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch((err) => {
//     console.log('Unable to connect to the database:', err);
//   });

  

// set up sequelize to point to our postgres database
// const sequelize = new Sequelize('neondb', 'neondb_owner', 'LN3kUM6AFTru', {
//   host: 'ep-empty-paper-a5jcsq0m.us-east-2.aws.neon.tech',
//   dialect: 'postgres',
//   port: 5432,
//   dialectOptions: {
//     ssl: { rejectUnauthorized: false },
//   },
// });

// // Define a "Project" model

// const Project = sequelize.define('Project', {
//   title: Sequelize.STRING,
//   description: Sequelize.TEXT,
// });

// synchronize the Database with our models and automatically add the
// table if it does not exist

// sequelize.sync().then(() => {
//   // create a new "Project" and add it to the database
//   Project.create({
//     title: 'Project1',
//     description: 'First Project',
//   })
//     .then((project) => {
//       // you can now access the newly created Project via the variable project
//       console.log('success!');
//     })
//     .catch((error) => {
//       console.log('something went wrong!');
//     });
// });


