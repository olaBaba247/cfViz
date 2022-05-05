const axios = require('axios');
const fs = require('fs');
const path = require("path");
const userHandle = "otnahs";
const rowFileName = "rowData.txt";
const requestLink = `https://codeforces.com/api/user.status?handle=${userHandle}`;
const loadDataFromCF= ()=>{
    axios.get(requestLink).then( ({statusCode,data}) => {
       const dd = new Date();
        console.clear();
        console.log(`last Loaded at: ${dd.toLocaleTimeString()}`)
        fs.writeFileSync(path.join(__dirname,rowFileName),JSON.stringify(data),err=>{
            if(err){
                console.log("error happend while writing row File")
            }
        })
        
        }).catch(er => console.log(er));

        return ;
}
// loadDataFromCF();
module.exports = {
    loadDataFromCF
}