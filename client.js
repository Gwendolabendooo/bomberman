        var socket = io.connect('http://localhost:8080');

        document.querySelector("#btnjoue").addEventListener('click', event => {
                document.querySelector("#allroom").style.display = "none";
                document.querySelector("#game").style.display = "block";
                console.log(click);
              })

        var room = ["alpha", "beta", "gamma", "delta", "epsilon", "lambda", "omicron", "sigma", "omega"];

        let params = (new URL(document.location)).searchParams;
        let roomname = params.get('room'); // la chaine de caractère "Jonathan Smith".

        socket.on('connexion', function(data) {
                room.forEach((serv) => {
                        if (roomname == serv) {
                                socket.emit('room', serv);
                        }
                });
        });
        var cpt = 0;
        if (cpt === 0 ) {
                setInterval(function(){ 
                        if (document.querySelector("#pseudoj") != null && cpt == 0 && document.querySelector("#pseudoj").innerHTML != "Pseudo") {
                                var newj = document.querySelector("#pseudoj").innerText;
                                const ctnj = [newj, roomname];
                                socket.emit('newpseudo', ctnj);
                                cpt++;
                        } 
                }, 300);       
        }

        socket.on('pseudo', function(data) {
                var elements = document.getElementsByClassName('participantroom');
                while(elements.length > 0){
                        elements[0].parentNode.removeChild(elements[0]);
                }
                while(document.getElementsByClassName('participant').length > 0){
                        document.getElementsByClassName('participant')[0].parentNode.removeChild(document.getElementsByClassName('participant')[0]);
                }
                console.log(data)
                data.forEach(element => document.querySelector("#invit").insertAdjacentHTML('beforeBegin', "<div class='participantroom'> <div class='pseudoroom'>"+ element[0] + "</div><img class='participant-img-room' src='./ressources/Face.png' alt=''> </div>"));
                data.forEach(element => document.querySelector("#participant").insertAdjacentHTML('beforeend', " <div class='participant'> <div class='pseudo'>"+ element[0] + "</div><img class='participant-img' src='./ressources/Face.png' alt=''> </div>"));
        });

        socket.on('deco', function(data) {
                console.log(data, 'explosion')
        });