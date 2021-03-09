var room = ["alpha", "beta", "gamma", "delta", "epsilon", "lambda", "omicron", "sigma", "omega"];

room.forEach((serv) => {
    document.querySelector("#ctnhub").insertAdjacentHTML('beforeend', "<div class='room'> <div class='nomroom'>" + serv + "</div><div class='listroom'> 2 / 4 </div><a href='./Room.html?room=" + serv + "'> <div class='btnroom'> Rejoindre </div></a> </div>");
});