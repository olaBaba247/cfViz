const {loadDataFromCF}= require('./createDataFile')
const {setData} = require('./processData');
const dataInterval = 3;
const port = 1702;
/**
 * call reload data in every 60 sec
 * 
 */
setInterval(()=>{
    loadDataFromCF();
},dataInterval*60*1000);
//end fucntion


const Express = require('express');
const app = Express();

app.set('view engine', 'ejs');
app.use(Express.static(__dirname +'/public'));
app.get('/',(req,res)=>{
    const {singleTag,multipleTag,totalSolved,totalSubmitted,problemGrade,today,last3Day,lastMonth,lastWeek} = setData();
    res.render('pages/index',{
        singleTag,multipleTag,totalSolved,
        totalSubmitted,problemGrade,today,
        last3Day,lastWeek,lastMonth
    });
})


app.listen(port,()=>{
    console.log("app is running at port "+port);
})