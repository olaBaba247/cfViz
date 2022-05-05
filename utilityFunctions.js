function sortObject(obj = {}) {
    return Object.entries(obj)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
}
function getBdTime(timeInMilliSeconds =Date.now()){
    const dateOptions = { timeZone: 'Asia/Dhaka' ,hour12: false };
    const parsedDate = new Date(timeInMilliSeconds);
    const oldDate = parsedDate.toLocaleString('en-US',dateOptions);
    let weekDay =parsedDate.getDay();
    let [dateArray,timeArray]=oldDate.split(',').map((v) => v.replaceAll(' ',''));
    let [month,date,year] = dateArray.split('/');
    return [date,month,year,weekDay];
}
function MsdifTime(acTime){
    return Math.ceil(Date.now()/1000) - acTime;
}
function diffTime(acTime,current = getBdTime(),weekDayS,last3DayMs){
    const subs = 30;
    const timeTable  = {
        day : 86400,
        threeDay :259200,
        week: 604800 ,
        month : 2629743
    }
    const [cfDay,cfMonth,cfYear]=getBdTime(acTime*1000); //[ '30', '4', '2022', 6 ]
    const [crDay,crMonth,crYear] = current;
    let point = 0;
    if( crMonth == cfMonth && crYear == cfYear){ 

        if(cfDay==crDay ){ //checking today
            return 4;
        }
        if(acTime>=last3DayMs){
            return 3;
        }
        if(acTime >= weekDayS){
            return 2;
        }
        
        return 1;
    }
    return point;
}
function getLastWeekDay(optionalDay=0){ //saturday
    const dayInSeconds = 86400;
    const day =optionalDay ||  new Date().getDay() ;
    const newDate = Date.now() - dayInSeconds*(day+1)*1000;
    return getBdTime(newDate); // [ '30', '4', '2022', 6 ]
}
function dateToMilliSeconds(date,month,year)
{
    month = (month <10) ? '0'+month : month;
    date = (date < 10 ) ? '0'+date : date;
    const str = `${year}-${month}-${date}T00:00:00`;
    const pdate = new Date(str);
    const Ndate = pdate.valueOf();
    // console.log(new Date(Ndate))
    return Math.floor(Ndate/1000);
}

// const p = (dateToMilliSeconds(...getLastWeekDay()))
// console.log(new Date(p*1000))
module.exports = {sortObject,MsdifTime,getBdTime,diffTime,getLastWeekDay,dateToMilliSeconds};
