const papel = document.getElementById("papelArrugado");
const empezar = document.getElementById("empezar");

papel.addEventListener("click",()=>{

    papel.style.transform="scale(1.25)";
    papel.innerHTML="📄";

    setTimeout(()=>{

        empezar.hidden=false;

    },500);

});

empezar.addEventListener("click",()=>{

    alert("Aquí comenzará el sorteo en la siguiente versión.");

});
