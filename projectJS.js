let loggedIn = false;
let count = 0;

$(document).ready(()=>
{
    setGetUser();
})


function setGetUser()
{
    if(localStorage.getItem('userKey') !== null)
    {
        $("#luserName").remove();
        $("#iuserName").remove();
        $("#lemail").remove();
        $("#iemail").remove();
        $("#userInfosbmt").remove();
        $("br").remove();
        loggedIn = true;
        showHide();
    }
    else
    {
        $("#userInfosbmt").click(() => 
        {
            let userName = $('#iuserName').val();
            let userEmail = $('#iemail').val();
            if(!validateEmail(userEmail))
            {
                $('#iemail').css({
                    "border-color": "#ff0000",
                    "border-style": "solid",
                    "border-width" : "1px"
                });
            }
            else if(!/[a-zA-Z]/.test(userName))
            {
                $('#iuserName').css({
                    "border-color": "#ff0000",
                    "border-style": "solid",
                    "border-width" : "1px"
                });
            }
            else
            {
                let userKey = userName + userEmail;
                localStorage.setItem('userKey', userKey); 
                location.reload();
                loggedIn = true;
                showHide();
            }
        })
    }

}

function grabData(count)
{
    let jsObj = {};

    jsObj.day = selectDay(count);
    jsObj.breakfast = $("#breakFastI").val();
    jsObj.amSnack = $("#amSnackI").val();
    jsObj.lunch = $("#lunchI").val();
    jsObj.pmSnack = $("#pmSnackI").val();
    jsObj.dinner = $("#dinnerI").val();
    jsObj.goal = $("#goalI").val();

    localStorage.setItem(selectDay(count), JSON.stringify(jsObj));
}

function fillData(count)
{
    if(localStorage.getItem(selectDay(count)) !== null)
    {
        let currentData = JSON.parse(localStorage.getItem(selectDay(count)))
        $("#breakFastI").val(currentData.breakfast)
        $("#amSnackI").val(currentData.amSnack);
        $("#lunchI").val(currentData.lunch);
        $("#pmSnackI").val(currentData.pmSnack);
        $("#dinnerI").val(currentData.dinner);
    }
}

function clearData()
{
    $("#breakFastI").val('');
    $("#amSnackI").val('');
    $("#lunchI").val('');
    $("#pmSnackI").val('');
    $("#dinnerI").val('');
}

function validateEmail(email)
{
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function showHide()
{
    if(loggedIn === true)
    {

        createElements();
        $("#dayOfWeek").html(selectDay(count));
        if(count == 0)
        {
            grabData(count)
            clearData();
            fillData(count)
            $("#prevButton").hide();
        }
        else
        {
            $("#prevButton").show();
        }

        $("#nextButton").click(() =>
        {

            grabData(count);
            clearData();
            count++;
            fillData(count)
            if(count === 6)
            {
                grabData(count);
            }
            if(count >= 6)
            {
                count = 6;
                $("#nextButton").hide();
                const form = document.getElementById("form");
                const buttonDiv = document.getElementById("buttonDiv");

                const goalDiv = document.createElement('div');
                goalDiv.id = "goalDiv";
                const goalL = document.createElement('label');
                goalL.className = 'goalLabel';
                goalL.innerHTML = "Weekly Goal: ";
                goalL.className = 'formLabel';
                goalL.setAttribute("for","goalI");
                const goalI = document.createElement('input');
                goalI.id = "goalI";
                goalI.type = "text";
                goalI.className = 'formInput';
                goalDiv.appendChild(goalL);
                goalDiv.appendChild(goalI); 

                form.insertBefore(goalDiv, buttonDiv);
                grabData(count)
                clearData();
                fillData(count)
            }

            $("#dayOfWeek").html(selectDay(count));

            if(count > 0)
            {
                $("#prevButton").show();
            }
        });

        $("#prevButton").click(() =>
        {
            grabData(count);
            count--;
            clearData();
            fillData(count)
            if(count <= 0)
            {
                count = 0;
                clearData();
                fillData(count)
                $("#prevButton").hide();
            }

            $("#dayOfWeek").html(selectDay(count));

            if(count < 6)
            {
                $("#goalDiv").remove();
                $("#nextButton").show();
            }
        });

        $("#clearButton").click(() => {
            for(let i = 0; i < 7; i++)
            {
                localStorage.removeItem(selectDay(i));
            }
        });

        $("#createButton").click(() => {
            if(count === 6)
            {
                grabData(count);
            }

            let formText;
            formText = ("<html>\n<head>\n<title>Meal Plan</title>\n<link rel='stylesheet' href='./assets/styles.css'>\n</head>\n<body>\n");

            for(let j = 0; j < 7; j++)
            {
                let grabDay = localStorage.getItem(selectDay(j));
                let currentDay = JSON.parse(grabDay);
                formText += ('<div class="currentDay"> ' + currentDay.day + '</div>');
                formText += ('<div class="breakfast"> Breakfast: ' + currentDay.breakfast + '</div>');
                formText += ('<div class="amSnack"> AM Snack: ' + currentDay.amSnack + '</div>');
                formText += ('<div class="lunch"> Lunch: ' + currentDay.lunch + '</div>');
                formText += ('<div class="pmSnack"> PM Snack: ' + currentDay.pmSnack + '</div>');
                formText += ('<div class="dinner"> Dinner: ' + currentDay.dinner + '</div>');
                if(j === 6)
                {
                    formText += ('<div class="goalHeader"> Weekly Goal </div>');
                    formText += ('<div class="goal"> ' + currentDay.goal + '</div>');
                }
            }

            formText += ("<button type='button' id='printButton'>Print</button></body>\n</html>");
            formText += ("<script> document.getElementById('printButton').addEventListener('click',printWindow); function printWindow(){window.print();}</script></body>\n</html>");

            flyWindow = window.open('about:blank','myPop','width=1920,height=1080,left=200,top=200');
            flyWindow.document.write(formText);

        });
    }
}

function createElements()
{
    const form = document.getElementById("form");
    const breakFastDiv = document.createElement('div');
    const amSnackDiv = document.createElement('div');
    const lunchDiv = document.createElement('div');
    const pmSnackDiv = document.createElement('div');
    const dinnerDiv = document.createElement('div');
    const buttonDiv = document.createElement('div');

    buttonDiv.id = "buttonDiv";

    const prevButton = document.createElement('button');
    prevButton.innerHTML = "Prev Day";
    prevButton.type = 'button';
    prevButton.id = 'prevButton';
    prevButton.style.color = 'black';
    prevButton.className = "buttons";

    const clearButton = document.createElement('button');
    clearButton.innerHTML = "Clear Planner";
    clearButton.style.color = 'black';
    clearButton.type = 'button';
    clearButton.id = 'clearButton';
    clearButton.className = "buttons";

    const createButton = document.createElement('button');
    createButton.innerHTML = "Create Plan!";
    createButton.style.color = 'black';
    createButton.type = 'button';
    createButton.id = 'createButton';
    createButton.className = "buttons";

    const nextButton = document.createElement('button');
    nextButton.innerHTML = "Next Day";
    nextButton.style.color = 'black';
    nextButton.type = 'button';
    nextButton.id = 'nextButton';
    nextButton.className = "buttons";

    const day = document.createElement('p');
    day.style.color = "black";
    day.id = "dayOfWeek";

    // Labels
    const breakFastL = document.createElement('label');
    const amSnackL = document.createElement('label');
    const lunchL = document.createElement('label');
    const pmSnackL = document.createElement('label');
    const dinnerL = document.createElement('label');
    // Inputs
    const breakFastI = document.createElement('input');
    breakFastI.id = "breakFastI";
    breakFastI.type = "text";
    const amSnackI = document.createElement('input');
    amSnackI.id = "amSnackI";
    amSnackI.type = "text";
    const lunchI = document.createElement('input');
    lunchI.id = "lunchI";
    lunchI.type = "text";
    const pmSnackI = document.createElement('input');
    pmSnackI.id = "pmSnackI";
    pmSnackI.type = "text";
    const dinnerI = document.createElement('input');
    dinnerI.id = "dinnerI";
    dinnerI.type = "text";

    breakFastL.className = 'formLabel';
    breakFastL.innerHTML = "Breakfast: ";
    breakFastL.setAttribute("for","breakFastI");
    amSnackL.className = 'formLabel';
    amSnackL.innerHTML = 'AM Snack: ';
    amSnackL.setAttribute("for","amSnackI");
    lunchL.className = 'formLabel';
    lunchL.innerHTML = 'Lunch: ';
    lunchL.setAttribute("for","lunchI");
    pmSnackL.className = 'formLabel';
    pmSnackL.innerHTML = 'PM Snack: ';
    pmSnackL.setAttribute("for","pmSnackI");
    dinnerL.className = 'formLabel';
    dinnerL.innerHTML = 'Dinner: ';
    dinnerL.setAttribute("for","dinnerI");

    breakFastI.className = 'formInput';
    amSnackI.className = 'formInput';
    lunchI.className = 'formInput';
    pmSnackI.className = 'formInput';
    dinnerI.className = 'formInput';
    
    breakFastDiv.appendChild(breakFastL);
    breakFastDiv.appendChild(breakFastI);
    amSnackDiv.appendChild(amSnackL);
    amSnackDiv.appendChild(amSnackI);
    lunchDiv.appendChild(lunchL);
    lunchDiv.appendChild(lunchI);
    pmSnackDiv.appendChild(pmSnackL);
    pmSnackDiv.appendChild(pmSnackI);
    dinnerDiv.appendChild(dinnerL);
    dinnerDiv.appendChild(dinnerI);
    buttonDiv.appendChild(clearButton);
    buttonDiv.appendChild(prevButton);
    buttonDiv.appendChild(nextButton);
    buttonDiv.appendChild(createButton);


    
    form.appendChild(day);
    form.appendChild(breakFastDiv);
    form.appendChild(amSnackDiv);
    form.appendChild(lunchDiv);
    form.appendChild(pmSnackDiv);
    form.appendChild(dinnerDiv);
    form.appendChild(buttonDiv);
}

function selectDay(count)
{
    switch(count)
    {
        case 0:
            return "Monday";
        case 1:
            return "Tuesday";
        case 2:
            return "Wednesday";
        case 3:
            return "Thursday";
        case 4:
            return "Friday";
        case 5:
            return "Saturday";
        case 6:
            return "Sunday";
        default:
            return null;
    }
}