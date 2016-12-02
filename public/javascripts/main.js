var cityDropdown = document.getElementById('city'),
cityList = document.getElementById('citylist'),
daysDropdown = document.getElementById('days'),
daysList = document.getElementById('dayslist'),
revolve = document.getElementById('revolve'),
viget = document.getElementById("viget"),
getcode = document.getElementById("getcode"),
vigetResult = document.getElementById("result"),
code = document.getElementById("codewrap"),
codeinput = document.getElementById("code"),
codeclose = document.getElementById("codeclose");
save = document.getElementById("save");
var dayAlias = {
  Sunday: "Воскресенье",
  Monday: "Понедельник",
  Tuesday: "Вторник",
  Wednesday: "Среда",
  Thursday: "Четверг",
  Friday: "Пятница",
  Saturday: "Суббота"
};
cityDropdown.onclick = function() {
  cityList.style.display = "block";
  daysList.style.display = "none";
};

daysDropdown.onclick = function () {
  daysList.style.display = "block";
  cityList.style.display = "none";
}

// cityDropdown.addEventListener("click", function () {
//   cityList.style.display = "block";
// });

cityList.onclick = function (e) {
  cityDropdown.textContent = e.target.textContent;
  // alert(e.target.innerHTML);
  cityDropdown.setAttribute("data-title", e.target.id);
  this.style.display = "none";
  setResult();
}

daysList.onclick = function (e) {
  daysDropdown.textContent = e.target.textContent;
  daysDropdown.setAttribute("data-title", e.target.id);
  this.style.display = "none";
  setResult();
}

revolve.onclick = function () {
  position = revolve.getAttribute("data-title");
  if (position === "1") {
    revolve.setAttribute("data-title", "2");
    viget.classList.add('vertical');
    revolve.textContent = "V";
  }else{
    revolve.setAttribute("data-title", "1");
    viget.classList.remove('vertical');
    revolve.textContent = "H";
  }
}

var date = new Date();
var today = date.getDay();
console.log(today);

function ajax(url, callback) {
  var data = {
    city_id: cityDropdown.getAttribute('data-title'),
    days: daysDropdown.textContent,
    position: revolve.getAttribute('data-title'),
    today: today
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = function(){
      if (this.readyState == 4) {
          if (this.status == 200)
              callback(JSON.parse(this.responseText));
          // иначе сетевая ошибка
      }
  };
  xhr.send(JSON.stringify(data));
};

function setResult() {
  ajax('/', function(data){
    console.log(data.result);
    var resultString = "";
    for (var i = 0; i < data.result.length; i++) {
      resultString += '<div class="viget-result-item"><div class="viget-result-item__heading">'+dayAlias[data.result[i].day]+'</div><div class="viget-result-item__text"><div> <p>Температура</p><p>'+data.result[i].high+' .. '+data.result[i].low+'</p></div></div></div>';
      data.result[i]
    }
    vigetResult.innerHTML = resultString;
  });
};

setResult();

function setVigetItem() {
  ajax('/setvigetitem', function(data){
    console.log(data);
    codeinput.value = data.code;
  });
};

function saveCinfid() {
  ajax('/saveconfig/'+save.getAttribute('data-title'), function(data){
    console.log(data);
  });
};

if (getcode) {
  getcode.onclick = function () {
    // setResult();
    code.style.display = "block";
    setVigetItem();
  };
  codeclose.onclick = function () {
    code.style.display = "none";
  };
};

if (save) {
  save.onclick = function () {
    saveCinfid();
  }
}
