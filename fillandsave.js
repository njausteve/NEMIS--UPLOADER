var request = require("request"),
    cheerio = require('cheerio');


exports.fillAndSubmitData = function(result, data,reqCookie){

    var mothersName;

    if(result.nameExist){
         
           mothersName = result.mothersName;
       
    }else{


        if(data.motherId == undefined){

               mothersName = "";
               data.motherId = '';
               data.motherMobile = '';
               data.motherEmail = '';

        }else{

            mothersName = data.mothersName;


        }
         
    }

      

    var options = {
        method: 'POST',
        url: 'https://nemis.education.go.ke/Learner/LearnerRegistration.aspx',
        headers: {
          'postman-token': 'd8dc8bcc-5d2f-2c7c-d726-7c0d219d3dcd',
          'cache-control': 'no-cache',
          cookie: reqCookie,
          'accept-language': 'en-US,en;q=0.9',
          'accept-encoding': 'gzip, deflate, br',
          referer: 'https://nemis.education.go.ke/Learner/LearnerRegistration.aspx',
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'x-devtools-emulate-network-conditions-client-id': '(20B39703E23F0BA6D79DEDC44C44F92)',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36 encors/0.0.6',
          'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryO0zW5IAZeBQH2kBV',
          'upgrade-insecure-requests': '1',
          origin: 'https://nemis.education.go.ke'
        },
        body: '------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="__EVENTTARGET"\r\n\r\n\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="__EVENTARGUMENT"\r\n\r\n\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="__LASTFOCUS"\r\n\r\n\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="__VIEWSTATE"\r\n\r\n' + result.viewstate +'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="__VIEWSTATEGENERATOR"\r\n\r\n970A614C\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="__EVENTVALIDATION"\r\n\r\n'+ result.eventValidation +'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtUPI"\r\n\r\n' +data.UPI+'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$ddlClass"\r\n\r\nClass 2   \r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$ddlmedicalcondition"\r\n\r\nNone\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$optspecialneed"\r\n\r\noptneedsno\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$ddlcounty"\r\n\r\n' + data.county +'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$ddlsubcounty"\r\n\r\n' + data.subcounty +'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtPostalAddress"\r\n\r\nP.O BOX 406-00217\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtEmailAddress"\r\n\r\n\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtmobile"\r\n\r\n\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtMotherIDNo"\r\n\r\n'+data.motherId+'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtMotherName"\r\n\r\n'+ mothersName + '\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtMotherUPI"\r\n\r'+data.motherEmail+'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtMothersContacts"\r\n\r\n'+ data.motherMobile+'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtFatherIDNO"\r\n\r\n ' + data.fatherId+'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtFatherName"\r\n\r\n' +data.fathersName+'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtFatherUPI"\r\n\r\n'+ data.fatherEmail+'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtFatherContacts"\r\n\r\n' + data.fatherMobile+'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtGuardianIDNO"\r\n\r\n ' + data.guardianId +'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtGuardianname"\r\n\r\n'+ data.guardianName+'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtGuardianUPI"\r\n\r\n'+ data.guardianemail +'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$txtGuardiancontacts"\r\n\r\n'+ data.guardianmobile+'\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$FileUpload1"; filename=""\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV\r\nContent-Disposition: form-data; name="ctl00$ContentPlaceHolder1$btnsave"\r\n\r\nClick here to Save \r\n------WebKitFormBoundaryO0zW5IAZeBQH2kBV--\r\n'
      };
      


    return new Promise(function (resolve, reject) {
        // Do async job
        request(options, function (error, response, body) {

            var $ = cheerio.load(body);

            if (error) {

                reject(error);

            } else {

                if ($('h2 > a').attr('href') === "/Login.aspx" || $('#form1').attr('action') === "./Login.aspx") {
                    reject("generateUPI -----> cookie expired or incorrect");
                } else if ($('h1').html() == 'Object Moved') {

                    reject("Problem with request URL, __VIEWSTATE, __EVENTVALIDATION or Missing paramenter");

                } else {



                    var Submitresult = {},
                    succesSavedUpiPatt = /Record saved successfully!!/;
                         
         
                    if (succesSavedUpiPatt.test($('#ContentPlaceHolder1_instmessage > div').text())) {

                        Submitresult.submitted = true;
                       

                    }else{


                        Submitresult.submitted = false;

                    }

                    resolve(Submitresult);

                }

            }

        })

    })

}