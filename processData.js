const fs = require("fs");
const path = require("path");
const fileName = "rowData.txt";
const filePath = path.join(__dirname, fileName);
const { sortObject,diffTime ,getBdTime,getLastWeekDay,dateToMilliSeconds} = require("./utilityFunctions");
const timeTable  = {
    min : 60,
    hour : 3600,
    day : 86400,
    threeDay :259200,
    week: 604800 ,
    month : 2629743
}
/// process row Data
function setData() {
    // loadDataFromCF();
    const rowdata = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rowdata);

    let { result } = data;
    const uniquList = new Set();
    const problemGradeList = {}; //a,b,c,d....
    const customList = {};
    const today = new Set();
    const last3Day = new Set();
    const lastWeek = new Set();
    const lastMonth = new Set();
    const onlySingleTag = {};
    let cnt = 0;
    let temptag;
    result.forEach((value) => {
        if (value.verdict == "OK") {
            const {creationTimeSeconds} = value;
            const { contestId, index, tags } = value.problem;
            // console.log(`${tags[0]=='implementation'}`)
            if (!uniquList.has(`${contestId}${index}`)) {
                const currentDateAr = getBdTime(Date.now());
                const weekDayInMs = dateToMilliSeconds(...getLastWeekDay());
                const last3DayMs = dateToMilliSeconds(...getLastWeekDay(3));
                const dt = diffTime(creationTimeSeconds,currentDateAr,weekDayInMs,last3DayMs) || 0;
                // console.log(dt)
                // console.log(`probelm : ${contestId}${index}  crt = ${creationTimeSeconds}  bdTm = ${getBdTime(creationTimeSeconds*1000)}  ${currentDateAr}  ${weekDayInMs} = ans = ${dt}`)
                if(dt>=1){
                    lastMonth.add(`${contestId}${index}`);
                }
                if(dt>=2){
                    lastWeek.add(`${contestId}${index}`);
                }
                if(dt>=3){
                    last3Day.add(`${contestId}${index}`);
                }
                if(dt==4){
                    today.add(`${contestId}${index}`);
                }



                uniquList.add(`${contestId}${index}`);
                if (problemGradeList[index]) {
                    problemGradeList[index]++;
                } else {
                    problemGradeList[index] = 1;
                }
                if (tags.length == 1) {
                    temptag = tags[0];
                    if (onlySingleTag[temptag]) {
                        onlySingleTag[temptag]++;
                    } else {
                        onlySingleTag[temptag] = 1;
                    }
                }
                tags.forEach((tag) => {
                    if (customList[tag]) {
                        customList[tag]++;
                    } else {
                        customList[tag] = 1;
                    }
                });
            }
        } else {
            cnt++;
        }
    });

    return {
        singleTag: sortObject(onlySingleTag),
        multipleTag: sortObject(customList),
        totalSolved : uniquList.size,
        totalSubmitted : result.length,
        problemGrade : sortObject(problemGradeList),
        today,
        last3Day,
        lastWeek,
        lastMonth
    };
}
module.exports = { setData}
//End of process row data
