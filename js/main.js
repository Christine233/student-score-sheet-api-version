function getElements() {
    let stuInfoObj = {};
    let subScore = [];
    stuInfoObj.name = document.getElementById("inputName").value;
    stuInfoObj.stuId = document.getElementById("inputStuId").value;
    stuInfoObj.nation = document.getElementById("inputNation").value;
    stuInfoObj.class = document.getElementById("inputClass").value;
    stuInfoObj.chinese = document.getElementById("inputChinese").value;
    stuInfoObj.math = document.getElementById("inputMath").value;
    stuInfoObj.english = document.getElementById("inputEnglish").value;
    stuInfoObj.coding = document.getElementById("inputCoding").value;
    subScore.push(parseFloat(stuInfoObj.chinese));
    subScore.push(parseFloat(stuInfoObj.math));
    subScore.push(parseFloat(stuInfoObj.english));
    subScore.push(parseFloat(stuInfoObj.coding));
    stuInfoObj.totalScore = totalScore(subScore);
    stuInfoObj.avgScore = stuInfoObj.totalScore/subScore.length;
    let reg = /^[\u4e00-\u9fa5A-Za-z]{2,},\d{10},[\u4e00-\u9fa5A-Za-z]+,\d+,\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?$/;
    let stuInfoStr = `${stuInfoObj.name},${stuInfoObj.stuId},${stuInfoObj.nation},${stuInfoObj.class},${stuInfoObj.chinese},${stuInfoObj.math},${stuInfoObj.english},${stuInfoObj.coding}`;
    if(stuInfoObj.name === '' || stuInfoObj.stuId === '' || stuInfoObj.nation === '' || stuInfoObj.class === '' || stuInfoObj.chinese === '' || stuInfoObj.math === '' || stuInfoObj.english === '' || stuInfoObj.coding === ''){
        alert("请按正确的格式输入！");
    } else if(reg.test(stuInfoStr)) {
        localStorage.setItem(`${stuInfoObj.stuId}`,JSON.stringify(stuInfoObj));
        addRow(stuInfoObj);
        alert(`"${stuInfoObj.name}"同学的成绩录入成功`);
    }else {
        alert("请按正确的格式输入！");
    }
}

// 计算总分
function totalScore(subScore) {
    let sum = 0;
    for (let i of subScore){
        sum += i;
    }
    return sum;
}

// 添加一行
function addRow(newStuInfoObj) {
    let tbody = document.getElementById('tbMain');
    let trow = getDataRow(newStuInfoObj); //定义一个方法,返回tr数据
    tbody.appendChild(trow);

    function getDataRow(newStuInfoObj) {
        let row = document.createElement('tr'); //创建行
        let nameCell = document.createElement('td'); //创建第一列name
        nameCell.innerHTML = newStuInfoObj.name; //填充数据
        row.appendChild(nameCell); //加入行
        let idCell = document.createElement('td');//创建第二列id
        idCell.innerHTML = newStuInfoObj.stuId;
        row.appendChild(idCell);
        let nationCell = document.createElement('td');//创建第三列nation
        nationCell.innerHTML = newStuInfoObj.nation;
        row.appendChild(nationCell);
        let classCell = document.createElement('td');//创建第四列class
        classCell.innerHTML = newStuInfoObj.class;
        row.appendChild(classCell);
        let chineseCell = document.createElement('td');//创建第五列chinese
        chineseCell.innerHTML = newStuInfoObj.chinese;
        row.appendChild(chineseCell);
        let mathCell = document.createElement('td');//创建第六列math
        mathCell.innerHTML = newStuInfoObj.math;
        row.appendChild(mathCell);
        let englishCell = document.createElement('td');//创建第七列english
        englishCell.innerHTML = newStuInfoObj.english;
        row.appendChild(englishCell);
        let codingCell = document.createElement('td');//创建第八列coding
        codingCell.innerHTML = newStuInfoObj.coding;
        row.appendChild(codingCell);
        let totalScorCell = document.createElement('td');//创建第九列sum
        totalScorCell.innerHTML = newStuInfoObj.totalScore;
        row.appendChild(totalScorCell);
        let avgScoreCell = document.createElement('td');//创建第十列avg
        avgScoreCell.innerHTML = newStuInfoObj.avgScore;
        row.appendChild(avgScoreCell);
        return row; //返回tr数据
    }
}

// 查询多个学生成绩信息
function searchStuInfo() {
    clearTable();
    let stuId = document.getElementById("search").value;
    let stuIdArr = stuId.split(' ');
    for(let stu of stuIdArr) {
        let flag = 0;
        for (let i = 0; i < localStorage.length; i++) {
            if(stu === localStorage.key(i)){
                addRow(JSON.parse(localStorage.getItem(stu)));
                flag ++;
            }
        }
        if(flag === 0){
            alert(`学号为${stu}的同学没有被录入`);
        }
    }
}

// 清空上次查询的数据
function clearTable() {
    let tbody = document.getElementById('tbMain');
    tbody.innerHTML = '';
}

// 准备修改一条学生信息
function beforeModifyStuInfo() {
    let modifyStuId = document.getElementById("modify").value;
    let flag = 0;
    for (let i = 0; i < localStorage.length; i++) {
        if(modifyStuId === localStorage.key(i)){
            // 使已存在且需要被修改的同学信息出现在弹出的模态框中
            document.getElementById('modifyName').value = JSON.parse(localStorage.getItem(modifyStuId)).name;
            document.getElementById('modifyStuId').value = JSON.parse(localStorage.getItem(modifyStuId)).stuId;
            document.getElementById('modifyNation').value = JSON.parse(localStorage.getItem(modifyStuId)).nation;
            document.getElementById('modifyClass').value = JSON.parse(localStorage.getItem(modifyStuId)).class;
            document.getElementById('modifyChinese').value = JSON.parse(localStorage.getItem(modifyStuId)).chinese;
            document.getElementById('modifyMath').value = JSON.parse(localStorage.getItem(modifyStuId)).math;
            document.getElementById('modifyEnglish').value = JSON.parse(localStorage.getItem(modifyStuId)).english;
            document.getElementById('modifyCoding').value = JSON.parse(localStorage.getItem(modifyStuId)).coding;
            flag ++;
        }
    }
    if(flag === 0){
        alert(`学号为${modifyStuId}的同学没有被录入`);
    }else{
        $('#modifyModal').modal('toggle');
    }
}

// 修改一条学生信息
function modifyStuInfo() {
    let stuInfoObj = {};
    let subScore = [];
    stuInfoObj.name = document.getElementById("modifyName").value;
    stuInfoObj.stuId = document.getElementById("modifyStuId").value;
    stuInfoObj.nation = document.getElementById("modifyNation").value;
    stuInfoObj.class = document.getElementById("modifyClass").value;
    stuInfoObj.chinese = document.getElementById("modifyChinese").value;
    stuInfoObj.math = document.getElementById("modifyMath").value;
    stuInfoObj.english = document.getElementById("modifyEnglish").value;
    stuInfoObj.coding = document.getElementById("modifyCoding").value;
    subScore.push(parseFloat(stuInfoObj.chinese));
    subScore.push(parseFloat(stuInfoObj.math));
    subScore.push(parseFloat(stuInfoObj.english));
    subScore.push(parseFloat(stuInfoObj.coding));
    stuInfoObj.totalScore = totalScore(subScore);
    stuInfoObj.avgScore = stuInfoObj.totalScore/subScore.length;
    alert(`"${stuInfoObj.name}"同学的成绩修改成功`);
    localStorage.setItem(`${stuInfoObj.stuId}`,JSON.stringify(stuInfoObj));
}

// 判断准备删除的学生信息是否存在
function beforeDelStuInfo() {
    let stuId = document.getElementById("del").value;
    let stuIdArr = stuId.split(' ');
    let flag = 0;
    for(let stu of stuIdArr) {
        for (let i = 0; i < localStorage.length; i++) {
            if(stu === localStorage.key(i)){
                flag ++;
            }
        }
        if(flag === 0) {
            alert(`学号为${stu}的同学没有被录入`);
        }else{
            delStuInfo();
        }
    }
}

// 删除同学信息
function delStuInfo() {
    let stuId = document.getElementById("del").value;
    let stuIdArr = stuId.split(' ');
    for(let stu of stuIdArr) {
        for (let i = 0; i < localStorage.length; i++) {
            if (stu === localStorage.key(i)) {
                localStorage.removeItem(stu);
                alert(`学号为${stu}的同学被成功删除`);
            }
        }
    }
}