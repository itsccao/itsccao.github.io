function themeLoad()
{
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = `/versions/v4/css/palettes/${localStorage.getItem("isTheme")}.css`;
    document.head.appendChild(link);
}

function backgroundImageLoad()
{
    if (localStorage.getItem("isBackgroundImage") === "Yes")
    {
        document.body.style.backgroundImage = `url('/versions/v4/assets/animated-background.webp')`;
    }
    else
    {
        document.body.style.backgroundImage = `none`;
        document.body.style.filter = "blur(20px);";
    }
}

if (!localStorage.getItem("isBackgroundImage"))
{
    localStorage.setItem("isBackgroundImage", "No");
}

if (!localStorage.getItem("isTheme") || localStorage.getItem("isTheme") === "Dark" || localStorage.getItem("isTheme") === "Light")
{
    localStorage.setItem("isTheme", "mocha");
}

backgroundImageLoad();
themeLoad();

const welcomeText = [
    "Xin chào",
    "Hello",
    "Hola",
    "Bonjour",
    "Hallo",
    "Ciao",
    "Olá",
    "Привет",
    "こんにちは",
    "안녕하세요",
    "你好",
    "مرحبا",
    "नमस्ते",
    "สวัสดี",
    "Salam",
    "Merhaba",
    "Sawubona",
    "Habari",
    "Shalom",
    "Hej"
];

//console.log(window.location.href);

if (document.getElementById("welcomeTextBody"))
{
    document.getElementById("welcomeTextBody").innerText = welcomeText[0] + "! ";

    var pos = 0, i = 1;

    function welcomeTextAnimation()
    {
        setInterval(function() {
            pos = i % 20;
            //console.log(pos, welcomeText[pos]);
            document.getElementById("welcomeTextBody").innerText = `${welcomeText[pos]}\! `;
            i++;
        }, 1500)
    }

    welcomeTextAnimation();
}