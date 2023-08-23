const socket = window.io();

socket.on("realTimeProducts", products => {
    let list = document.getElementById("ulProducts");
    let returnList = "";
    
    products.forEach(el => {
        returnList = returnList + `<li>${el.id} ${el.title} - U$S ${el.price}</li>`;
    });

    list.innerHTML = returnList;
});
