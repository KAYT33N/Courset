var keys = [];
var lessons = [];
var lesson = new Map();
var selected = [];
const persianDays = [
  "شنبه",
  "يك شنبه",
  "دو شنبه",
  "سه شنبه",
  "چهار شنبه",
  "پنج شنبه",
];
const isTheory = [
  'ع',
  'ت'
];


function init() {
  const testPattern = /<td>.*<\/td>/gm ;
  if (!testPattern.test(document.getElementById('input').value)) {
    alert('لطفا در وارد کردن اطلاعات دقت کنید');
    return false;
  }
  //copy to storage
  document.getElementById('STORAGE').innerHTML = document.getElementById('input').value;
  //initialize
  document.querySelector("tr.DTitle").parentNode.id = "MAINTABLE";
  document.querySelector("tr.DTitle").remove();
  const elements = document.querySelectorAll("#MAINTABLE > tr");
  const classPattern = /درس\((.)\):\s*(يك شنبه|دو شنبه|سه شنبه|چهار شنبه|پنج شنبه|شنبه)\s*(..):(..)-(..):(..)/gm ;
  const finalPattern = /\(....\...\...\).{0,20}..:..-..:../gm ;
  elements.forEach((item, i) => {
    let classes = [];
    let row21 = item.childNodes[21].innerHTML;
    let matchC;
    //extract classes data
    while (matchC = classPattern.exec(row21)) {
      classes.push({
        day: persianDays.indexOf(matchC[2]),
        start: ((((parseInt(matchC[3])*60) + parseInt(matchC[4])) - 420)/840)*100,
        end: 100-(((((parseInt(matchC[5])*60) + parseInt(matchC[6])) - 420)/840)*100),
        theory: isTheory.indexOf(matchC[1])
      });
    }
    //extract final datamatchF[0]
    let final = "تعریف نشده است";
    let matchF = row21.match(finalPattern);
    if (matchF) {
      final = matchF[0];
    }
    //push lesson code to keys array
    keys.push('c'+item.childNodes[7].innerHTML.replace(/_/, "-"));
    //push lesson data to lessons array
    lessons.push({
      code: item.childNodes[7].innerHTML,
      name: item.childNodes[9].innerHTML,
      vahedTotal: item.childNodes[11].innerHTML,
      vahedAmali: item.childNodes[13].innerHTML,
      capacity: item.childNodes[15].innerHTML,
      sex: item.childNodes[17].innerHTML,
      teacher: item.childNodes[19].innerHTML,
      classes: classes,
      final: final,
      place: item.childNodes[23].innerHTML,
      requirement: item.childNodes[25].innerHTML,
      other: item.childNodes[27].innerHTML
    });
  });
  //filling ul list
  createList();
  //mapping
  for(let i = 0; i < keys.length; i++){
        lesson.set(keys[i], lessons[i]);
  }
  document.getElementById('landing').remove();
}

function hover(ev){
  removeTemps();
  const id = ev.target.id;
  if (selected.indexOf(id) > 0) {
    return false;
  }
  createEvents(id,1);
}

function select(ev){
  removeTemps();
  const id = ev.target.id;
  if (selected.indexOf(id) > -1) {
    return false;
  }
  selected.push(id);
  createEvents(id,0);
  refreshSelected();
}

function deSelect(ev){
  const id = ev.target.parentNode.classList[0];
  selected.splice(selected.indexOf(id), 1);
  let toRemove = document.querySelectorAll('.column .'+id);
  for (var i = 0; i < toRemove.length; i++) {
    toRemove[i].remove();
  }
  refreshSelected();
}

function removeTemps(){
  let eles = document.getElementsByClassName('temp');
  for (var i = 0; i < eles.length; i++) {
    eles[i].remove();
  }
}

function refreshSelected() {
  const table =  document.getElementById('selectedLessons');
  if (selected.length < 1) {
    table.innerHTML = "<tr id='notSelected'><td colspan='6'>درسی انتخاب نشده است</td></tr>" ;
    return false;
  }
  table.innerHTML = '' ;
  for (var i = 0; i < selected.length; i++) {
    let data = lesson.get(selected[i]);
    let row = document.createElement('tr');
    row.innerHTML = "<td>"+data.name+"</td>" +
      "<td>"+data.code+"</td>" +
      "<td>"+data.teacher+"</td>" +
      "<td>"+data.vahedTotal+"</td>" +
      "<td>"+data.vahedAmali+"</td>" +
      "<td>"+data.final+"</td>";
    row.classList.add('c'+data.code.replace(/_/, "-"));
    row.addEventListener('click',deSelect);
    table.appendChild(row);
  }
}

function createEvents(id, temp) {
  const data = lesson.get(id);
  const classes = data.classes;
  classes.forEach((item, i) => {
    let ele = document.createElement('div');
    ele.innerHTML = "<span dir='ltr'>" + data.code + "</span><br>" + data.name + "<br>" + data.teacher;
    ele.style.top = item.start+"%";
    ele.style.bottom = item.end+"%";
    if(temp){
      ele.classList.add("temp");
    }else {
      ele.classList.add(id);
      let closeBtn = document.createElement('div');
      closeBtn.innerHTML = "&#10006;";
      closeBtn.addEventListener('click',deSelect);
      ele.appendChild(closeBtn);
    }
    document.getElementsByClassName(item.day)[0].appendChild(ele);
  });
}

function refreshPage() {
  if (confirm("با تایید این پیام تمامی تغییرات از دست خواهند رفت")) {
    location.reload();
  }
  return false ;
}

function createList(string = ''){
  const list = document.getElementById('list');
  let matchFound = false;
  list.innerHTML = '';
  lessons.forEach((item, i) => {
    if ((item.name).match(string)) {
      let ele = document.createElement('li');
      ele.innerHTML = item.name;
      ele.id = keys[i];
      ele.addEventListener('mouseenter',hover);
      ele.addEventListener('click',select);
      list.appendChild(ele);
      matchFound = true;
    }
  });
  if (!matchFound) {
    let ele = document.createElement('li');
    ele.innerHTML = 'موردی یافت نشد';
    list.appendChild(ele);
  }
}
