let express = require('express');
let app = express();
let redies = require('redis');
let client = redies.createClient();
let bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
let urlencodedParser = bodyParser.urlencoded({ extended: false });

// 阶段二
let count = 0;
app.get('/', function (req, res) {
    count++;
    client.set('times',count);
    client.get('times',function (err,reply) {
        res.send(reply)
    })
});

app.use(express.static(__dirname));
app.get('/third.html', function (req, res) {
    res.sendFile( __dirname + "/" + "third.html" );
});

// 阶段三
app.post('/add-anything', urlencodedParser, function (req, res) {
    let response = req.body.num;
    client.set('author',response);
    client.get('author',function (err,reply) {
        res.send(reply)
    });
    console.log(response);
});

app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
});

// 阶段四：判断输入的学生成绩格式是否正确，输入格式正确则将学生成绩存入Redis，并将学生成绩以JSON格式返回
let subjectNum = 4;
app.post('/student', urlencodedParser, function (req, res) {
    let stuInfoObj = {
        name : req.body.inputName,
        stuId : req.body.inputStuId,
        nation : req.body.inputNation,
        class : req.body.inputClass,
        chinese : req.body.inputChinese,
        math : req.body.inputMath,
        english : req.body.inputEnglish,
        coding : req.body.inputCoding,
        sum : calcSum(),
        aver : calcSum()/subjectNum
    };
    // 计算总分
    function calcSum() {
        return parseFloat(req.body.inputChinese) + parseFloat(req.body.inputMath) + parseFloat(req.body.inputEnglish) + parseFloat(req.body.inputCoding);
    }

    let reg = /^[\u4e00-\u9fa5A-Za-z]{2,},\d{10},[\u4e00-\u9fa5A-Za-z]+,\d+,\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?$/;
    let stuInfoStr = `${stuInfoObj.name},${stuInfoObj.stuId},${stuInfoObj.nation},${stuInfoObj.class},${stuInfoObj.chinese},${stuInfoObj.math},${stuInfoObj.english},${stuInfoObj.coding}`;
    if(stuInfoObj.name === '' || stuInfoObj.stuId === '' || stuInfoObj.nation === '' || stuInfoObj.class === '' || stuInfoObj.chinese === '' || stuInfoObj.math === '' || stuInfoObj.english === '' || stuInfoObj.coding === ''){
        res.status(400).send(`400!请按正确的格式输入！`);
    } else if(reg.test(stuInfoStr)) {
        client.set(stuInfoObj.stuId,JSON.stringify(stuInfoObj));
        client.get(stuInfoObj.stuId,function (err,reply) {
            res.send(reply);
        });
        console.log(stuInfoObj);
    }else {
        res.status(400).send(`400!请按正确的格式输入！`);
    }
});

// 阶段五：查询，输入格式正确则在Redis中查询对应的学生成绩，以JSON格式返回所查询学生的成绩以及他们的总分平均分和总分中位数
let stuInfoArr = [];
app.get('/students', function (req, res){
    let stuId = req.query.search;
    let reg = /^\d{10}$/;
    let flag = 0;
    let stuIdArr = stuId.split(' ');
    for(let stu of stuIdArr){
        if(!reg.test(stu)){
            flag++;
            res.status(400).send(`400!请按正确的格式输入！`);
        }
    }
    if(flag === 0){
        for(let i = 0; i < stuIdArr.length; i++){
            client.get(stuIdArr[i], function (err,student){
                stuInfoArr.push(JSON.parse(student));
                if(i === stuIdArr.length-1){
                    res.send(stuInfoArr);
                }
            });
        }
    }
});

// 阶段六：修改
app.post('/students/:id', urlencodedParser, function (req, res){
    let modifyStu = req.params.id;
    let stuInfoObj = {
        name : req.body.modifyName,
        stuId : req.body.modifyStuId,
        nation : req.body.modifyNation,
        class : req.body.modifyClass,
        chinese : req.body.modifyChinese,
        math : req.body.modifyMath,
        english : req.body.modifyEnglish,
        coding : req.body.modifyCoding,
        sum : calcSum(),
        aver : calcSum()/subjectNum
    };
    // 计算总分
    function calcSum() {
        return parseFloat(req.body.modifyChinese) + parseFloat(req.body.modifyMath) + parseFloat(req.body.modifyEnglish) + parseFloat(req.body.modifyCoding);
    }

    let reg = /^[\u4e00-\u9fa5A-Za-z]{2,},\d{10},[\u4e00-\u9fa5A-Za-z]+,\d+,\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?$/;
    let stuInfoStr = `${stuInfoObj.name},${stuInfoObj.stuId},${stuInfoObj.nation},${stuInfoObj.class},${stuInfoObj.chinese},${stuInfoObj.math},${stuInfoObj.english},${stuInfoObj.coding}`;
    if(stuInfoObj.name === '' || stuInfoObj.stuId === '' || stuInfoObj.nation === '' || stuInfoObj.class === '' || stuInfoObj.chinese === '' || stuInfoObj.math === '' || stuInfoObj.english === '' || stuInfoObj.coding === ''){
        res.status(400).send(`400!请按正确的格式输入！`);
    } else if(reg.test(stuInfoStr)) {
        client.set(modifyStu,JSON.stringify(stuInfoObj));
        client.get(modifyStu,function (err,reply) {
            res.send(reply);
        });
        console.log(stuInfoObj);
    }else {
        res.status(400).send(`400!请按正确的格式输入！`);
    }
});

// 阶段七：删除
app.delete('/students/:id', function (req, res) {
    let delStuId = req.params.id;
    client.del(delStuId, function(err, response) {
        if (response === 1) {
            res.send('该学生已成功删除');
        } else{
            res.status(404).send('该学生不存在');
        }
    });
});
// Because the DEL command will return (integer) 1 in successful operation.
// redis 127.0.0.1:6379> DEL key
// Success: (integer) 1
// Unsuccess: (integer) 0

app.listen(3000, function () {
    console.log('Example app listening on port 3000.');
});


