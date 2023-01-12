
// for different functions see the link https://dmitripavlutin.com/6-ways-to-declare-javascript-functions/#1-function-declaration

// console.log(module);
// console.log(module.exports);

/******* Different methods to exports *******/
// 1. 
// module.exports.getDate = getDate;   
// var getDate = function(){
// }


// 2.
module.exports.getDate = function (){
    
    const today = new Date();
    // let currentDay = today.getDay();
    // let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // let day = weekdays[currentDay];

    const options = {
        day: "numeric",
        weekday: "long",
        month: "long"
    }
    
    const day = today.toLocaleDateString("en-US", options);
    return day;
}


// 3.
module.exports.getDay = getDay;
function getDay(){

    const today = new Date();
    const options = {
        weekday: "long",
    }

    const day = today.toLocaleDateString("en-US", options);
    return day;
}
