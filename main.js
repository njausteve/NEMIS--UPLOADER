var request = require("request"),
  cheerio = require('cheerio'),
  csv = require("fast-csv"),
  fs = require('fs'),
  find = require('./findUpi.js'),
  generate = require('./generateUpi.js'),
  getForm = require('./fetchFormWithUpi'),
  save = require('./saveUPi'),
  fill = require('./fillandsave.js'),
  validate = require('./validate.js');


var reqCookie = 'ASP.NET_SessionId=5v10cmi5yhxbcy1pl4swj0hs';


var resViewStatefindUPI, resEventValidationFindUPI;
var sourceDataPath = './documents/2E/class 2E.csv';
var destDataPath = './documents/2E/class 2E UPI.csv';
var rs = fs.createReadStream(sourceDataPath);
var ws = fs.createWriteStream(destDataPath);
var csvStream = csv.createWriteStream({
  headers: true
});
csvStream.pipe(ws);

csv
  .fromStream(rs, {
    headers: true
  })
  .on("data", function(data) {


    var upiCheckData = {};


    if (data.UPIsearchParam !== 'Birth Certificate' || data.birthNo === '') {


      console.log("wrong or missing bith certificate details for : " + data.firstname + " " + data.surname);

      data.upifindstatus = " failed: missing Birth certificate details";


      csvStream.write(data);


    } else {
      //start UPI search

      upiCheckData.UPIsearchParamText = data.birthNo;

      findUpiPromise = new find.findUpi(upiCheckData, data, reqCookie)

        .then(function(result) {


          // console.log("findUpiPromise for " + data.firstname + data.surname + " resolved : ");
          //  console.log("findUPI: ", result);


          if (result.exist) {


            data.upifindstatus = "upi already exists";

            data.UPI = result.UPI;

            console.log('UPI for : ' + data.firstname + ' ' + data.surname + " birth cert no exists: Birth certNo : " + data.birthNo + " is --------> " + result.UPI);


            //function invoke form data verifivation
            initiateFormFilling(result, data);
      //csvStream.write(data);
            


          } else {


            console.log('UPI not found for: ' + data.firstname + ' ' + data.surname + " birth cert no --------> " + data.birthNo);

            data.upifindstatus = "UPI not found";

            //loop through Generate & save promises.

            //    while( data.generatedupisave !== "success"){

            generateSave(data);


          }


        }, errHandler);


    }


  })

  .on("end", function() {
    console.log("reading stream done");
    console.log('finding UPI...');

  });


var errHandler = function(err) {
  console.log(err);
};

function generateSave(data) {

  return new generate.generateUpi(reqCookie)
    .then(function(result) {

      // console.log('data inside callback : ', result);

      if (result.UPI !== '') {

        data.upigeneratestatus = "success";

        console.log('UPI generation for ' + data.firstname + ' ' + data.surname + " birth cert number " + data.birthNo + ' success -------> UPI: ' + result.UPI);


        if (data.firstname == '' || data.othername == '' || data.surname == '' || data.dob == '' || data.gender == '') {

          console.log('Wrong or missing firstname, othername, surname, dob or gender fields for : ' + data.firstname + ' ' + data.surname + " birthcert no -------> " + data.birthNo);

          data.generatedupisave = 'failed: wrong/missing paramters';

          csvStream.write(data);

        } else {


          ///HEADED TO SAVE

          saveGeneratedUpiPromise = new save.saveGeneratedUpi(result, data, reqCookie)


            .then(function(saveGeneratedUpiresult) {

              console.log('saveGeneratedUpiPromise resolved : ', saveGeneratedUpiresult);

              //if generatedUpi not saved

              if (!saveGeneratedUpiresult.saved) {

                data.generatedupisave = "failed : UPI duplicate";

                console.log('initiating UPI  regeneration/save  for ' + data.firstname + data.surname + " birth cert No ----> " + data.birthNo);

                generateSave(data);


              } else {

                //generated UPI saved


                data.generatedupisave = "success";

                data.UPI = saveGeneratedUpiresult.UPI;

                console.log('UPI assignment/save for ' + data.firstname + ' ' + data.surname + " birth cert number " + data.birthNo + ' success -------> UPI: ' + saveGeneratedUpiresult.UPI);


                initiateFormFilling(result, data);


              }


            }, errHandler);

        }

      } else {

        //upi generation fail

        data.upigeneratestatus = "failed";
        console.log('UPI generation for ' + data.firstname + ' ' + data.surname + " birth cert number " + data.birthNo + ' failed');

        csvStream.write(data);

      }


    }, errHandler);

}



// fetching and verifyingform data function

function initiateFormFilling(result, data) {

  return new getForm.fetchLearnerForm(result, data, reqCookie)

    .then(function(result) {

      data.fetchLearnerForm = "success";

      //if form not filled
      if (!result.isformFilled) {



        if (result.correctData) {

          console.log('Form is not filled --- form filling INTITIATED for : ' + data.firstname + ' ' + data.surname + ' UPI -----> ' + result.UPI);
          data.isformfilled = "no";

         

          validateCounty(result, data, reqCookie);

        } else {

          console.log('Form is not filled (WRONG NAME) --- form not INTITIATED for : ' + data.firstname + ' ' + data.surname + ' UPI -----> ' + result.UPI);
          data.isformfilled = "no : check names ";
          
          csvStream.write(data);

        }

      } else {

        if (!result.correctData) {

          //form already filled : wrong name
          console.log('Form is filled with WRONG NAMES --- form not initiated for : ' + data.firstname + ' ' + data.surname + ' UPI -----> ' + result.UPI);
          data.isformfilled = "yes : incorect names values";

          csvStream.write(data);

        } else {

          //form already filled : proper name
          console.log('Form is already filled for : ' + data.firstname + ' ' + data.surname + ' UPI -----> ' + result.UPI);
          data.isformfilled = "yes ";

          csvStream.write(data);

        }

      }

    }, errHandler);

}


function validateCounty(result, data, reqCookie) {

  return new validate.validateCountyName(result, data, reqCookie)

    .then(function(result) {

      if (result.validated) {

        data.countyValidationstatus = 'validated';

        console.log('County Validation for : ' + data.firstname + ' ' + data.surname + " UPI " + data.UPI + " SUCCESS");

        validateSubcounty(result, data, reqCookie);

      } else {

        data.countyValidationstatus = 'failed';

        csvStream.write(data);

        console.log('County Validation for : ' + data.firstname + ' ' + data.surname + " UPI " + data.UPI + " FAILED");

      }

    }, errHandler);

}



function validateSubcounty(result, data, reqCookie) {

  return new validate.validateSubCountyName(result, data, reqCookie)

    .then(function(result) {

      if (result.validated) {

        data.subcountyValidationstatus = 'validated';

        console.log('Subcounty Validation for : ' + data.firstname + ' ' + data.surname + " UPI " + data.UPI + " SUCCESS");

        //fillAndSubmit(result, data,reqCookie);
        validateMothersId(result, data, reqCookie);

      } else {

        data.subcountyValidationstatus = 'failed';

        csvStream.write(data);

        console.log('Subcounty Validation for : ' + data.firstname + ' ' + data.surname + " UPI " + data.UPI + " FAILED");

      }

    }, errHandler);
}

function validateMothersId(result, data, reqCookie) {

  return new validate.validateMothersIdData(result, data, reqCookie)

    .then(

      function(result) {

        if (!result.nameExist) {

          //submit form with name from data

          console.log('mothers Validation for : ' + data.firstname + ' ' + data.surname + " UPI " + data.UPI + " SUCCESS");

          data.motherIDvalidationstatus= "validated";

          fillAndSubmit(result, data, reqCookie);

        } else {

          console.log('mothers Validation for (name from Database ) : ' + data.firstname + ' ' + data.surname + " UPI " + data.UPI + " SUCCESS");

          data.motherIDvalidationstatus = "validated: name from server";

          fillAndSubmit(result, data, reqCookie);

        }

      }, errHandler);
}



function fillAndSubmit(result, data, reqCookie) {

  return fill.fillAndSubmitData(result, data, reqCookie)

    .then(

      function(result) {
        if (result.submitted) {

          data.formSubmitStatus = "success";

          console.log("\n ========================== SUCCESFULLY FILLED FORM ============================= \n");
          console.log('                   Name:' + data.firstname + " " + data.othername + " " + data.surname);
          console.log('                   UPI :' + data.UPI);
          console.log('          Birth Cert no:' + data.birthNo + "\n");
          console.log("========================== SUCCESFULLY FILLED FORM ============================= \n ");

          csvStream.write(data);

        } else {

          data.formSubmitStatus = "failed";

          csvStream.write(data);

        }

      }, errHandler);


}