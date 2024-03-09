const legoData = require("./modules/legoSets");
const path = require("path");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;
app.set('view engine', 'ejs');
app.use(express.static('public'));


// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, "/views/home.html"));
// });

app.get('/', (req, res) => {
  res.render("home"); 
});

// app.get('/about', (req, res) => {
//   res.sendFile(path.join(__dirname, "/views/about.html"));
// });

app.get('/about', (req, res)=> {
  res.render("about");
});

app.get("/lego/sets", async (req, res) => {

  let sets = []; 
  try {
    if (req.query.theme) {
      sets = await legoData.getSetsByTheme(req.query.theme);
    } else {
      sets = await legoData.getAllSets();
    }
    res.render("sets", {sets});
  } catch (err) {
    // 에러 페이지를 렌더링할 때는 오류 메시지를 문자열로 전달합니다.
    res.status(404).render("404", { message: "No sets found for the specified theme." });
  }
});

app.get("/lego/sets/:num", async (req, res) => {
  try {
    let set = await legoData.getSetByNum(req.params.num); // 'set' 변수 사용
    // 하나의 세트만 렌더링해야 하므로, 배열로 래핑하거나 다른 뷰를 사용해야 합니다.
    res.render("set", {set});
  } catch (err) {
    res.status(404).render("404", { message: "No sets found for the specified theme." });
  }
});

app.use((req, res, next) => {
  res.status(404).render("404", { message: "No sets found for the specified theme." });
});



legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});