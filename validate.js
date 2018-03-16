var request = require("request"),
  cheerio = require('cheerio');


exports.validateCountyName = function(result, data, reqCookie) {

  var options = {
    method: 'POST',
    url: 'https://nemis.education.go.ke/Learner/LearnerRegistration.aspx',
    headers: {
      'postman-token': '1ba7edef-fb26-2d4e-e5d7-96b5b197a669',
      'cache-control': 'no-cache',
      cookie: reqCookie,
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData: {
      __EVENTTARGET: 'ctl00$ContentPlaceHolder1$ddlcounty',
      __VIEWSTATE: result.viewstate,
      __EVENTVALIDATION: result.eventValidation,
      'ctl00$ContentPlaceHolder1$ddlcounty': data.county
    }


  };

  // Return new promise
  return new Promise(function(resolve, reject) {
    // Do async job

    request(options, function(error, response, body) {
    
       console.log('reg for  county'+ data.firstname + " " +data.surname );
       console.log(options);

      console.log("request for county "+ data.firstname + " " +data.surname + body);

      var $ = cheerio.load(body);

      if (error) {

        reject(error);

      } else {

        if ($('h2 > a').attr('href') === "/Login.aspx" || $('#form1').attr('action') === "./Login.aspx") {
          reject("generateUPI -----> cookie expired or incorrect");
        } else if ($('h1').html() == 'Object Moved') {

          reject("Problem with request URL, __VIEWSTATE, __EVENTVALIDATION or Missing paramenter");

        } else {


          var countyValidateresult = {};


          //    console.log("-------------------------" + $("#ContentPlaceHolder1_ddlcounty option:selected").val() + "\n" + "-------------------------" + data.county + " for ---> " + data.firstname);

          if ($("#ContentPlaceHolder1_ddlcounty option:selected").val().toUpperCase() == data.county.toUpperCase()) {


            data.countyValidationstatus = 'validated';
            countyValidateresult.validated = true;
            countyValidateresult.viewstate = $('#__VIEWSTATE').val();
            countyValidateresult.eventValidation = $('#__EVENTVALIDATION').val();

          } else {

            countyValidateresult.validated = false;


          }

          resolve(countyValidateresult);

        }

      }

    })

  })

}


exports.validateSubCountyName = function(result, data, reqCookie) {

  var options = {
    method: 'POST',
    url: 'https://nemis.education.go.ke/Learner/LearnerRegistration.aspx',
    headers: {
      'postman-token': '6d7bad8b-45a2-0224-6367-0d837c19f0f0',
      'cache-control': 'no-cache',
      cookie: reqCookie,
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData: {
      __EVENTTARGET: 'ctl00$ContentPlaceHolder1$ddlsubcounty',
      __VIEWSTATE: result.viewstate,
      __EVENTVALIDATION: result.eventValidation,
      'ctl00$ContentPlaceHolder1$ddlsubcounty': data.subcounty,
    }
  };

  // Return new promise
  return new Promise(function(resolve, reject) {

    // Do async job



    request(options, function(error, response, body) {

      var $ = cheerio.load(body);

      if (error) {

        reject(error);

      } else {

        if ($('h2 > a').attr('href') === "/Login.aspx" || $('#form1').attr('action') === "./Login.aspx") {
          reject("generateUPI -----> cookie expired or incorrect");
        } else if ($('h1').html() == 'Object Moved') {

          reject("Problem with request URL, __VIEWSTATE, __EVENTVALIDATION or Missing paramenter");

        } else {


          var SubCountyValidateresult = {};


          console.log($("#ContentPlaceHolder1_ddlsubcounty").val() + " subcounty for " + data.birthNo);

          //   console.log("-------------------------" + $("#ContentPlaceHolder1_ddlsubcounty option:selected").val() + "\n" + "-------------------------" + data.subcounty);

          if ($("#ContentPlaceHolder1_ddlsubcounty").val().trim().toUpperCase() == data.subcounty.trim().toUpperCase()) {


            SubCountyValidateresult.validated = true;
            SubCountyValidateresult.viewstate = $('#__VIEWSTATE').val();
            SubCountyValidateresult.eventValidation = $('#__EVENTVALIDATION').val();

          } else {

            SubCountyValidateresult.validated = false;

          }

          resolve(SubCountyValidateresult);

        }

      }

    })

  })


}


exports.validateMothersIdData = function(result, data, reqCookie) {

  var options = {
    method: 'POST',
    url: 'https://nemis.education.go.ke/Learner/LearnerRegistration.aspx',
    headers: {
      'postman-token': 'a8fa96fe-4c51-2502-759e-1de98ad0e858',
      'cache-control': 'no-cache',
      cookie: reqCookie,
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData: {
      __EVENTTARGET: 'ctl00$ContentPlaceHolder1$txtMotherIDNo',
      __VIEWSTATE: result.viewstate,
      __EVENTVALIDATION: result.eventValidation,
      'ctl00$ContentPlaceHolder1$txtMotherIDNo': data.motherId
    }
  };

  // Return new promise
  return new Promise(function(resolve, reject) {
    // Do async job



    request(options, function(error, response, body) {

      var $ = cheerio.load(body);

      if (error) {

        reject(error);

      } else {

        if ($('h2 > a').attr('href') === "/Login.aspx" || $('#form1').attr('action') === "./Login.aspx") {
          reject("generateUPI -----> cookie expired or incorrect");
        } else if ($('h1').html() == 'Object Moved') {

          reject("Problem with request URL, __VIEWSTATE, __EVENTVALIDATION or Missing paramenter");

        } else {


          var motherIdValidateresult = {};

          //   console.log("-------------------------" + $("#ContentPlaceHolder1_ddlsubcounty option:selected").val() + "\n" + "-------------------------" + data.subcounty);

          if ($("#ContentPlaceHolder1_txtMotherName").val() == "No record found") {


            motherIdValidateresult.nameExist = false;
            motherIdValidateresult.viewstate = $('#__VIEWSTATE').val();
            motherIdValidateresult.eventValidation = $('#__EVENTVALIDATION').val();

          } else {

            if ($("#ContentPlaceHolder1_txtMotherName").val() == undefined) {


              motherIdValidateresult.nameExist = false;
              motherIdValidateresult.viewstate = $('#__VIEWSTATE').val();
              motherIdValidateresult.eventValidation = $('#__EVENTVALIDATION').val();


              console.log('mothers ID neither returned "No record found" nor MOTHERS NAME');


            } else {



              motherIdValidateresult.nameExist = true;
              motherIdValidateresult.viewstate = $('#__VIEWSTATE').val();
              motherIdValidateresult.eventValidation = $('#__EVENTVALIDATION').val();
              motherIdValidateresult.mothersName = $("#ContentPlaceHolder1_txtMotherName").val();

              console.log("-------- MOTHERS NAME returned for: " + data.firstname + " " + data.surname + "is : " + $("#ContentPlaceHolder1_txtMotherName").val() + " -------------------- ");


            }

          }

          resolve(motherIdValidateresult);

        }

      }

    })

  })

}