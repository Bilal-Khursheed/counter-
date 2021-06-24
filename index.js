async function Counter() {
  fetch(
      'CSV_DATASET.xlsx')
    .then(res =>
      res.blob()) // Gets the response and returns it as a blob
    .then(async blob => {
      // Like calling ref().put(blob)
      let file = new File([blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      var xl2json = new ExcelToJSON();
      xl2json.parseExcel(file);
    });

}
var ExcelToJSON = function () {

  this.parseExcel = function (file) {
    console.log(file);
    var reader = new FileReader();

    reader.onload = function (e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      // console.log(workbook, 'workjaskbc');
      workbook.SheetNames.forEach(function (sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[
          sheetName]);
        var json_object = JSON.parse(JSON.stringify(XL_row_object));
        let cards = []
        setInterval(() => {
          // Get today's date and time

          json_object.map((item, index) => {

            let count = moment(item.COUNTDOWN, 'DD/MM/YYYY HH:mm:ss');
            var countDownDate = new Date(count).getTime();
            var countDownDatecur = new Date().getTime();
            let remaining = countDownDate - countDownDatecur;
            var days = Math.floor(remaining / (1000 * 60 * 60 * 24));
            var hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            let years = parseInt(days / 365)
            days = days - (years * 365);
            if (countDownDate > countDownDatecur) {
              document.getElementById('COUNTDOWN' + index).innerHTML =`<strong>`+ years + ' :' + days + ' : ' + hours + " : " + minutes + " : " + seconds + '' +`</strong>`+`<p>ANNI     GIORNI    ORE   MIN   SEC</p>`;
            } else {
              document.getElementById('COUNTDOWN' + index).innerHTML = 'Expired'
            }
          })
        }, 1000);
        json_object.map((item, index) => {
          console.log(item)
          cards.push(`<div class="card" id="card">
          <div class="container">
            <h4><b  id="ID">${'#'+item.ID}</b></h4> 
            <p id="CATEGORY">${item.CATEGORY}</p> 
            <strong id="TITLE">${item.TITLE}</strong> 
            <p class = "COUNTDOWN" id="COUNTDOWN${index}"></p> 
            <p class= "bc" id="SCIENCE_DATA" >OPINIONE SCIENTIFICA            :            <strong id="bc">     ${item.SCIENCE_DATA}</strong> </p> 
             <p class = "bc" id="OPINION_DATA"> OPINIONE PUBBLICA          :              <strong id="bc">     ${item.DIFFERENCE}</strong></p> 
          </div>
        </div>`);
        })
        jQuery('#xlx_json').html(cards);
      })
    };

    reader.onerror = function (ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  };
};