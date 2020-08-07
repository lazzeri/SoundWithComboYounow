var broadcastId;
var userId;
var self = this;
this.peerId = uuidv4();
this.signalingWS = null;
var error = false;


var paneltimecounter = [];

var eventsToTrigger = [];


var lastName = "";
var lastValue = "";
var comboCounter = 2;

var userName = "Sanji-oker";


async function RunCode()
{
    console.log(userName);
    await DownloadGifts();
    FetchBroadcastId();

}

async function DownloadGifts()
{
    console.log("Fetching Gifts...");
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
        targetUrl = 'https://ynassets.younow.com/giftsData/live/de/data.json';
    var json = fetch(proxyUrl + targetUrl)
        .then(blob => blob.json())
        .then(data => {
            json = JSON.stringify(data, null, 2);
            goodies = JSON.parse(json);
        });
}

async function Retry()
{
    console.log("Retrying in 5 seconds");
    await sleep(5000);
    error = false;
    FetchBroadcastId();
}
function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}
async function FetchBroadcastId()
{
    console.log("Fetching Broadcast....");
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
        targetUrl = 'https://api.younow.com/php/api/broadcast/info/curId=0/user=' + userName;
    var json = fetch(proxyUrl + targetUrl)
        .then(blob => blob.json())
        .then(data => {
            json = JSON.stringify(data, null, 2);
            var done = JSON.parse(json);
            if(json.length < 1)
            {
                console.log("No Data Found");
                error = true;
            }
            else if(done.errorCode != 0)
            {
                console.log("User not online or not found");
                error = true;
            }
            if(error)
            {
                console.log("Error Found Retrying")
                Retry();
                return;
            }
            else
            {
                userId = done.userId;
                broadcastId = done.broadcastId;
                console.log("Data Found");
                FetchEvent();
                return;
            }
        })
        .catch(e => {
        });
}

function FetchEvent()
{
    //First Startup Connection:
    console.log("Succesfully Connected to WebSocket");


    var pusher = new Pusher('d5b7447226fc2cd78dbb', {
        cluster: "younow"
    });
    var channel = pusher.subscribe("public-channel_" + userId);
    
    //Get Gifts
    channel.bind('onGift', function(data) {

        var foundName = data.message.stageGifts[0].name;
        console.log(foundName);
        if(data.message != "undefined")
        {
            console.log("Gift number:" + data.message.stageGifts[0].giftId);

            var foundGift;
            var foundValue;

            for(b = 0; b < goodies.goodies.length; b++)
            {
                if(data.message.stageGifts[0].giftId == goodies.goodies[b].id)
                {
                    foundGift = goodies.goodies[b].SKU;
                    foundValue = goodies.goodies[b].cost;
                }
            }

            console.log(foundGift + " = found gift with cost: " + foundValue + " with name " + foundName);


            //Set First Value
            var test = lastName.localeCompare("");
            if(test == 0)
            {
                lastValue = foundValue;
                lastName = foundName;
                console.log("Found First Gift");
                firstGift(foundValue,foundName);
            }
            else
            {

                if(lastName == foundName && lastValue == foundValue && foundValue >= 15)
                {
                    castCombo(comboCounter);
                    comboCounter++;
                    console.log("Found Combo");
                }
                else
                {
                    firstGift(foundValue,foundName);
                    lastName = foundName;
                    lastValue = foundValue;
                    comboCounter = 2;
                    document.getElementById("Container").innerHTML = "";
                    console.log("Found Combo Break");
                }
            }
        }
    });
}

async function firstGift(foundValue,foundName)
{

    if(foundValue <= 100 && foundValue >= 15)
    {
        var audio = new Audio('music/audio50.mp3');
        audio.play();
    }
    else if(foundValue <= 200 && foundValue > 100)
    {
        var audio = new Audio('music/audio400.mp3');
        audio.play();
    }
    else if(foundValue == 500)
    {
        var audio = new Audio('music/audio1000.mp3');
        audio.play();
    }
    else if(foundValue == 1000)
    {
        var audio = new Audio('music/audio2000.mp3');
        audio.play();
    }
    else if(foundValue > 1000)
    {
        var audio = new Audio('music/audio2500.mp3');
        audio.play();
    }

}

function playComboSound(value) {
    switch(value)
    {

        case 2:
            var audio = new Audio('music/combo2.mp3');
            audio.play();
            console.log('2');
            break;

        case 3:
            var audio = new Audio('music/combo3.mp3');
            audio.play();
            console.log('3');

            break;

        case 4:
            var audio = new Audio('music/combo4.mp3');
            audio.play();
            console.log('4');

            break;

        case 5:
            var audio = new Audio('music/combo5.mp3');
            audio.play();
            console.log('5');

            break;

        default:
            var audio = new Audio('music/combo5.mp3');
            audio.play();
            console.log('above 5');

            break;
    }

}

async function castCombo(value)
{
    
    playComboSound(value);
    //Cast instant Vanishes after 2 Seconds
    //We just change the text if after two seconds nothing comes in we vanish
    if(value >= 0 && value < 5)
    {
        document.getElementById("Container").style.color = "white";
    }
    else if(value >= 5 && value < 10)
    {
        document.getElementById("Container").style.color = "green";
    }
    else if(value >= 10 && value < 15)
    {
        document.getElementById("Container").style.color = "orange";
    }
    else
    {
        document.getElementById("Container").style.color = "red";
    }
    document.getElementById("Container").innerHTML = "x" + value;

    await sleep(3400);


    //Here we need to check if the Combo reset or not. Hardest part.
    if(document.getElementById("Container").innerHTML == "x" + value)
    {
        document.getElementById("Container").style.color = "white";
        document.getElementById("Container").innerHTML = "";
    }
}


function uuidv5() {
    return 'xxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


function sleep(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)); }



function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}