const actividades = [
    "Actividad 1 - Requisa",
    "Actividad 2 - Bienvenida",
    "Actividad 3 - Principio y Fundamento",
    "Actividad 4 - Vida de Alberto Hurtado",
    "Actividad 5 - Introducción al autoconocimiento",
    "Actividad 6 - Pausa Ignaciana 1",
    "Actividad 7 - Oración 1",
    "Actividad 8 - Personalidad",
    "Actividad 9 - Autoestima",
    "Actividad 10 - Familia",
    "Actividad 11 - Orientación",
    "Actividad 12 - Reconocimiento de mi pecado",
    "Actividad 13 - Perdón",
    "Actividad 14 - Pausa Ignaciana 2",
    "Actividad 15 - Oración 2",
    "Actividad 16 - Mi relación con Dios",
    "Actividad 17 - Cómo encontrar a Dios en mi vida",
    "Actividad 18 - Plan de Dios",
    "Actividad 19 - Servicio",
    "Actividad 20 - Ceremonia de cruces"
];

const participantes = [
    "André T",
    "Bernardo R",
    "Rafael C",
    "Jose N",
    "Camila J",
    "Luciana S",
    "María del Carmen",
    "Camila A",
    "Fabiana R",
    "Mateo V",
    "Alejandra Z",
    "Isabella V"
];

const grupoRestringido = [
    "Jose N",
    "Camila J",
    "Luciana S",
    "María del Carmen"
];

const actividadesPermitidasGrupo = [
    6,7,14,15,16,17,18,19,20
];

const btnEmpezar = document.getElementById("btnEmpezar");
const papel = document.getElementById("papelArrugado");
const pantallaInicio = document.getElementById("pantallaInicio");
const pantallaSorteo = document.getElementById("pantallaSorteo");
const estado = document.getElementById("estado");
const contenedor = document.getElementById("contenedorPapeles");

papel.addEventListener("click", () => {

    papel.textContent = "📄";
    papel.style.transform = "scale(1.15)";

    setTimeout(() => {
        btnEmpezar.hidden = false;
    }, 500);

});

btnEmpezar.addEventListener("click", () => {

    pantallaInicio.classList.add("oculto");
    pantallaSorteo.classList.remove("oculto");

    estado.textContent = "Realizando sorteo...";

    setTimeout(() => {

        const resultado = realizarSorteo();

        estado.textContent = "Haz clic en un papel para descubrir al responsable.";

        mostrarResultado(resultado);

    }, 1500);

});

function mezclar(array){

    const copia = [...array];

    for(let i = copia.length - 1; i > 0; i--){

        const j = Math.floor(Math.random() * (i + 1));

        [copia[i], copia[j]] = [copia[j], copia[i]];

    }

    return copia;

}
function realizarSorteo(){

    while(true){

        const asignaciones = {};

        participantes.forEach(nombre => {
            asignaciones[nombre] = [];
        });

        let disponibles = [...actividades];

        const dosActividadesGrupo = mezclar(grupoRestringido).slice(0,2);

        const cantidad = {};

        participantes.forEach(nombre => {

            if(nombre === "Bernardo R" || nombre === "Alejandra Z"){

                cantidad[nombre] = 1;

            }else if(grupoRestringido.includes(nombre)){

                cantidad[nombre] = dosActividadesGrupo.includes(nombre) ? 2 : 1;

            }else{

                cantidad[nombre] = 2;

            }

        });

        const permitidas = disponibles.filter((a,i)=>{

            const numero = i+1;

            return actividadesPermitidasGrupo.includes(numero);

        });

        let permitidasMezcladas = mezclar(permitidas);

        for(const persona of grupoRestringido){

            for(let i=0;i<cantidad[persona];i++){

                if(permitidasMezcladas.length===0){

                    break;

                }

                const actividad = permitidasMezcladas.shift();

                asignaciones[persona].push(actividad);

                disponibles.splice(disponibles.indexOf(actividad),1);

            }

        }

        let restantes = [];

        for(const persona of participantes){

            if(grupoRestringido.includes(persona)) continue;

            for(let i=0;i<cantidad[persona];i++){

                restantes.push(persona);

            }

        }

        restantes = mezclar(restantes);

        disponibles = mezclar(disponibles);

        let valido = true;

        while(disponibles.length){

            const actividad = disponibles.shift();

            let candidatos = restantes.filter(p=>{

                return asignaciones[p].length < cantidad[p];

            });

            if(candidatos.length===0){

                valido=false;
                break;

            }

            const numero = actividades.indexOf(actividad)+1;
            if(numero===12 || numero===13){

                const otros = candidatos.filter(p =>
                    p !== "Bernardo R" &&
                    p !== "Alejandra Z"
                );

                if(otros.length){
                    candidatos = otros;
                }

            }

            if([
                1,6,7,9,14,15,16,17,18,19,20
            ].includes(numero)){

                if(
                    candidatos.includes("Mateo V") &&
                    Math.random() < 0.70
                ){
                    candidatos = ["Mateo V"];
                }

            }

            const elegido = candidatos[
                Math.floor(Math.random()*candidatos.length)
            ];

            asignaciones[elegido].push(actividad);

            restantes.splice(
                restantes.indexOf(elegido),
                1
            );

        }

        if(!valido){
            continue;
        }

        return asignaciones;

    }

}

function mostrarResultado(asignaciones){

    contenedor.innerHTML="";

    const lista=[];

    for(const persona in asignaciones){

        asignaciones[persona].forEach(actividad=>{

            lista.push({
                actividad,
                persona
            });

        });

    }

    lista.sort((a,b)=>{

        const na=parseInt(a.actividad.match(/\d+/)[0]);

        const nb=parseInt(b.actividad.match(/\d+/)[0]);

        return na-nb;

    });
    lista.forEach(item=>{

        const papel=document.createElement("div");
        papel.className="papel";

        const tarjeta=document.createElement("div");
        tarjeta.className="tarjeta";

        const frente=document.createElement("div");
        frente.className="cara frente";

        frente.innerHTML=`
            <h3>${item.actividad.split(" - ")[0]}</h3>
            <p>${item.actividad.split(" - ")[1]}</p>
        `;

        const atras=document.createElement("div");
        atras.className="cara atras";
        atras.textContent=item.persona;

        tarjeta.appendChild(frente);
        tarjeta.appendChild(atras);

        tarjeta.addEventListener("click",()=>{

            if(tarjeta.classList.contains("girada")){
                return;
            }

            tarjeta.classList.add("girada");

        });

        papel.appendChild(tarjeta);

        contenedor.appendChild(papel);

    });

}
