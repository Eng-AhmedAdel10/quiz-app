// setup
const questionArea=document.querySelector(".questionArea");
const answerArea=document.querySelector(".answerArea");
const spans=document.querySelector(".bulltes .spans");
const bullteBox=document.querySelector(".bulltes");
const timerQuestion=document.querySelector(".timerQuestion");
const status=document.querySelector(".status");
const questionsCount=document.querySelector(".questionsCount span");
const btnSubmit=document.querySelector(".btnSubmit");
const success=document.getElementById("success");
const fail=document.getElementById("fail");


// options
let data,
    count=0,
    timerInterval,
    rightAnswer=0,
    chossenAnswerCount=0;



// function getData
function getData()
{
    // XMLHttpRequest
    const req = new XMLHttpRequest()
    req.onreadystatechange = function () {
        if (req.status == 200 && req.readyState == 4) 
        {   
             data=JSON.parse(req.responseText);
            // trigger insertData
            insertData(data[count]);
            // trigger bulltes
            bulltes(data);
            // trigger timer
            timer(10);
            // show questionsCount
            questionsCount.innerHTML=data.length;
            }
    }
    req.open("get", "app/quiz.json");
    req.send(); 
}


// trigger getData
getData();


// function insertData
function insertData(data)
{
    // empty questionArea and answerArea
    questionArea.innerHTML="";
    answerArea.innerHTML=""; 
    // create question in html
    const h2=document.createElement("h2");
    const h2Text=document.createTextNode(data.title);
    h2.appendChild(h2Text);
    questionArea.appendChild(h2);

    // create answers in html
    for(i=0;i<4;i++)
    {   
    // create div answer
        const answer=document.createElement("div");
        answer.className="answer";
   
    // create input radio
        const radio=document.createElement("input");
        radio.type="radio";
        radio.dataset.answer=data[`answer_${i+1}`];
        radio.id=`answer_${i+1}`;
        radio.name="answer";
    // create label
        const label=document.createElement("label");
        label.htmlFor=`answer_${i+1}`;
        const labelText=document.createTextNode(data[`answer_${i+1}`]);
        label.appendChild(labelText);
    
    // add radio and lablel in div answer
        answer.appendChild(radio);
        answer.appendChild(label);

    // add div answer in parent div (answerArea)
        answerArea.appendChild(answer);

    // 
        if(i==0)
        {
            radio.checked=true;
        }
    }
}


// function bulltes
function bulltes(data)
{
 for(i=0;i<data.length;i++)
    {   
        // create span
        const span=document.createElement("span");
        spans.appendChild(span);
        // make first span blue
        if(i==0)
        {
            span.classList.add("active");
        }
    }
}


// function timer
function timer(duration)
{   
         timerInterval=setInterval(()=>{
        // set valueof minutes and seconds
        let minutes,seconds;
        minutes=parseInt(duration/60);
        seconds=parseInt(duration%60);
        // check if less than 10 to add zero
        minutes=minutes<10 ?`0${minutes}`:minutes;
        seconds=seconds<10 ?`0${seconds}`:seconds;
        // add to html
        timerQuestion.innerHTML=minutes+":"+seconds;
        // if time finish stop timer 
        if(--duration<0)
        {
            clearInterval(timerInterval);
            btnSubmit.onclick();
        }
    },1000);
}

// on click submitAnswer
btnSubmit.onclick=()=>{
    submitAnswer(data);
}

// function submitAnswer
function submitAnswer(data)
{
    const spans=document.querySelectorAll(".bulltes .spans span");
    // trigger checkAnswer
    if(chossenAnswerCount < data.length)
    {
        checkAnswer(data[count]);
        chossenAnswerCount++;
    }
    
    if(++count < data.length)
    {
        // trigger insertData
        insertData(data[count]);
        // make bullet blue
        spans[count].classList.add("active");
        // stop timer
        clearInterval(timerInterval);
        // trigger timer 
        timer(10);
    }
    if(count==data.length)
        {
            // stop timer
            clearInterval(timerInterval);
            // clear insetData
            questionArea.remove();
            answerArea.remove();
            btnSubmit.remove();
            bullteBox.remove();
            result(data);
        }
}

// function checkAnswer
function checkAnswer(data)
{
    let inputs=document.getElementsByName("answer");
    inputs.forEach(item=>{
        if(item.checked==true)
        {
            if(item.dataset.answer == data.right_answer)
            {
                rightAnswer++;
            }
            
        }
    })
 }


//  function result
function result(data)
{
    status.classList.add("active");

    let text;
        status.innerHTML+=rightAnswer +` of ${data.length}`;
        const span=document.createElement("span");
        if(rightAnswer < 4.5)
        {
            span.className="failed";
            text=document.createTextNode("failed");
            fail.play();
        }
        else if(rightAnswer >4.5 && rightAnswer<=7)
        {
            span.className="good";
            text=document.createTextNode("good");
            success.play();
        }
        else
        {
            span.className="flaunt";
            text=document.createTextNode("flaunt");
            success.play();
        }
        span.appendChild(text);
        status.appendChild(span);    
}