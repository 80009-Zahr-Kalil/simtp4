const probabilidades = [
    [0.10, 0.35, 0.85, 1],  // 31 Reservas
    [0.05, 0.30, 0.80, 0.95, 1],  // 32 Reservas
    [0, 0.05, 0.25, 0.70, 0.90, 1],  // 33 Reservas
    [0, 0.05, 0.15, 0.55, 0.85, 0.95, 1]  // 34 Reservas
]
const valorPasaje = 100;
const costoPerdida = 150;

var tablaMonteCarlo = document.getElementById("tablaMonteCarlo");

var cantidadRegistros;
var vueloDesde;
var vueloHasta;
var cantidadReservas;


var registroVuelos = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]

]
var grillaFinal = [];


function obtenerInputs() {
    cantidadRegistros = Number(document.getElementsByClassName("textbox")[0].value);
    vueloDesde = Number(document.getElementsByClassName("textbox")[1].value);
    vueloHasta = Number(document.getElementsByClassName("textbox")[2].value);
    cantidadReservas = Number(document.getElementById("selector").value) + 30;
    return [cantidadRegistros, vueloDesde, vueloHasta, cantidadReservas];
}

function pasajerosPresentes(cantidadReservas, random) {
    var pasajeros = 0;
    var indice = cantidadReservas - 31;

    for(var i=0; i<probabilidades[indice].length; i++) {
        if(random < probabilidades[indice][i]) {
            pasajeros = 28 + i;
            return pasajeros;
        }
    }
}

function calcularSobrantes (totalPresentes){
    var sobrantes;
    if (totalPresentes > 30){
        sobrantes = totalPresentes - 30; 
    } else {
        sobrantes = 0; 
    }
    return sobrantes;
}

function calcularTotalPresentes (sePresentan, sobrantes){
    var total = sePresentan + sobrantes;
    return total;
}

function calcularIngreso(presentes){
    var ingreso = presentes * valorPasaje;
    return ingreso;
}

function calcularPerdida(sobrantes){
    var perdida = 0;
    if(sobrantes > 0){
        perdida = sobrantes * costoPerdida;
    }
    return perdida;
}

function calcularUtilidad(ingreso, perdida){
    var utilidad = ingreso - perdida;
    return utilidad;
}


function montecarlo() {
    registroVuelos = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    grillaFinal = [];
    var N = obtenerInputs()[0];
    var desde = obtenerInputs()[1];
    var hasta = obtenerInputs()[2];
    var reservas = obtenerInputs()[3];

    var utilidadAcumulada = 0;
    for(var i=1; i<=N; i++) {
        registroVuelos.splice(0, 1);
        var vueloActual = i;
        var rnd = Math.random();
        var sePresentan = pasajerosPresentes(reservas, rnd);
        var totalPresentes = calcularTotalPresentes(sePresentan, registroVuelos[0][4]);
        var sobrantes = calcularSobrantes(totalPresentes);
        var ingreso = calcularIngreso(sePresentan);
        var perdida = calcularPerdida(sobrantes);
        var utilidad = calcularUtilidad(ingreso, perdida);
        utilidadAcumulada += utilidad;
        var insertarRegistro = [vueloActual, rnd, sePresentan, totalPresentes, sobrantes, ingreso, perdida, utilidad, utilidadAcumulada];

        registroVuelos.push(insertarRegistro);

        if((i >= desde && i <= hasta) || i == N) {
            grillaFinal.push(insertarRegistro);
        }
    }

    console.log(registroVuelos);
    return grillaFinal;
}

function rellenarTabla() {
    tablaMonteCarlo.innerHTML = "<tr><th>N° Vuelo</th><th>Rnd</th><th>Se Presentan</th><th>Total Presentes</th><th>Sobrantes</th><th>Ingreso</th><th>Perdida</th><th>Utilidad</th><th>Utilidad AC</th></tr>";
    var grilla = montecarlo();
    for(var i=0; i<grilla.length; i++) {
        var cadena = '<tr><td>' + grilla[i][0] +'</td>'
        cadena += '<td>' + (grilla[i][1]).toFixed(2) + '</td>';
        cadena += '<td>' + (grilla[i][2]).toFixed(0) + '</td>';
        cadena += '<td>' + grilla[i][3] + '</td>';
        cadena += '<td>' + grilla[i][4] + '</td>';
        cadena += '<td>' + grilla[i][5] + '</td>';
        cadena += '<td>' + grilla[i][6] + '</td>';
        cadena += '<td>' + grilla[i][7] + '</td>';
        cadena += '<td>' + grilla[i][8] + '</td></tr>';
        tablaMonteCarlo.innerHTML += cadena;
    }

    var utilidadPromedio = grilla[grilla.length-1][8] / grilla[grilla.length-1][0];
    var elemUtilidad = document.getElementById("utilidadPromedio");
    elemUtilidad.innerHTML = "Utilidad Promedio = " + utilidadPromedio.toFixed(2);
    if(utilidadPromedio > 2800) {
        elemUtilidad.style.background = "rgb(50, 160, 83)";
    } else {
        elemUtilidad.style.background = "rgb(136, 38, 38)";
    }
    elemUtilidad.style.display = "block";
}


function main() {
    rellenarTabla();
    tablaMonteCarlo.style.display = "block";
}

document.getElementById("btnGenerar").addEventListener('click', () => {
    main();
})


// for(var i=0; i<=N; i++) {
//     registroVuelos[i%2][0] = i;
//     if((i >= desde && i <= desde + cantidad) || i == N) {
//         var cadena = '<tr><td>'+i+'</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>'
//         document.getElementById("tablaMonteCarlo").innerHTML += cadena;
//         grillaFinal.push([i, 0, 0, 0, 0]);
//     }
// }
// console.log(grillaFinal);





// const probabilidades = [
//     [0.1,0.35,0.85,1],
//     [0.1,0.30,0.8,0.95,1],
//     [0,0.05,0.25,0.7,0.9,1],
//     [0,0.05,0.15,0.55,0.85,0.95,1]];
// const pasaje = 100; // lo que vale el pasaje


// function pasajerosPresentes(cantReservas,rnd){   // pueden ser 31,32,33,34
//     var pasajeros;
//     var indice = cantReservas - 31;
    
//     for (var i= 0; i< probabilidades[indice].length; i++){
//         if(rnd < probabilidades[indice][i]){
//             pasajeros = 28+i;
//             console.log("pasajeros"+pasajeros);
//             return pasajeros;
            
//         }
//     }
// }

// function calcularSobrantes (totalPresentes){ // calcula los sobrantes 
//     var sobrantes = 0;
//     if (totalPresentes<30){
//         sobrantes = totalPresentes -30; 
//     }
//     sobrantes = 0; 
//     return sobrantes;
// }

// function totalPresentes (pasajeros,sobrantes){
//     var total = pasajeros + sobrantes;
//     return total;
// }

// function calcularIngreso(presentes){
//     var ingreso = presentes*pasaje;
//     return ingreso;
// }

// function calcularPerdida(sobrantes){
//     var perdida = 0;
//     if(sobrantes > 0){
//         perdida = sobrantes*150;
//     }
//     return perdida;
// }

// function calcularUtilidad(ingreso,perdida){
//     var utilidad = ingreso-perdida;
//     return utilidad;
// }

// function monteCarlo(){
//     // ??
// }