var request = require("request"),
  cheerio = require('cheerio'),
  save = require('./saveUPi');


exports.generateUpi = function(reqCookie) {


  // Setting URL and headers for request
  var options = {
    method: 'GET',
    url: 'https://nemis.education.go.ke/Institution/people.aspx',
    headers: {
      'postman-token': '8f2fc6d7-c70f-0962-51ac-e9270c3c1f53',
      'cache-control': 'no-cache',
      'cookie': reqCookie
    }
  };

  //console.log(options);
  
  // Return new promise
  return new Promise(function(resolve, reject) {
    // Do async job
    request(options, function(error, response, body) {

      //console.log(body);

      if (error) {

        reject(error);

      } else {

        var $ = cheerio.load(body);

        if ($('h2 > a').attr('href') === "/Login.aspx" || $('#form1').attr('action') === "./Login.aspx") {

          reject("generateUPI -----> cookie expired or incorrect");
        } else if ($('h1').html() == 'Object Moved') {

          reject("Problem with request URL, __VIEWSTATE, __EVENTVALIDATION or Missing paramenter");

        } else if(body == "The service is unavailable"){


          reject({error: "findUPI -----> The service is unavailable "});  

        }else {

          //getTempUPI + __EVENTVALIDATION +


          var generatedUPIdata = {};

          generatedUPIdata.UPI = $('#ContentPlaceHolder1_UPI').val();
          generatedUPIdata.viewstate = $('#__VIEWSTATE').val();
          generatedUPIdata.eventValidation = $('#__EVENTVALIDATION').val();


          //         console.log('generatedUPIdata', generatedUPIdata);

          resolve(generatedUPIdata);

         // console.log('generatedUPIdata========>', generatedUPIdata);
        }

      }

    })
  })

}


// exports.generateUPIcallback = function(result, data, reqCookie) {

//   // console.log('data inside callback : ', result);

//   if (result.UPI !== '') {

//     data.upigeneratestatus = "success";

//     console.log('UPI generation for ' + data.firstname + ' ' + data.surname + " birth cert number " + data.birthNo + ' success -------> UPI: ');


//     if (data.firstname == '' || data.othername == '' || data.surname == '' || data.dob == '' || data.gender == '') {

//       console.log('Wrong or missing firstname, othername, surname, dob or gender fields for : ' + data.firstname + ' ' + data.surname + " birthcert no -------> " + data.birthNo);

//       data.generatedupisave = 'failed: wrong/missing paramters';

//       csvStream.write(data);

//     } else {



//       var saveGeneratedUpiPromise = new save.saveGeneratedUpi(result, data, reqCookie)

//         .then(function(saveGeneratedUpiresult) {

//           console.log('saveGeneratedUpiPromise resolved : ', saveGeneratedUpiresult);

//           //if generatedUpi not saved

//           if (!saveGeneratedUpiresult.saved) {

//             data.generatedupisave = "failed";

//             console.log('initiating UPI generation / save  for ' + data.firstname + data.surname + " birth cert No ----> " + data.birthNo);

//           } else {

//             //generated UPI saved


//             data.generatedupisave = "success";

//             data.UPI = saveGeneratedUpiresult.UPI;

//             console.log('UPI assignment/save for ' + data.firstname + ' ' + data.surname + " birth cert number " + data.birthNo + ' success -------> UPI: ' + saveGeneratedUpiresult.UPI);

//             csvStream.write(data);

//           }


//         }, errHandler);


//     }

//   } else {

//     //upi generation fail

//     data.upigeneratestatus = "failed";
//     console.log('UPI generation for ' + data.firstname + ' ' + data.surname + " birth cert number " + data.birthNo + ' failed');

//   }



//   return result;

// }


// var errHandler = function(err) {
//   console.log(err);
// };