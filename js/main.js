function actualizar_graficos(){
  grafico_2d(array);
  function initMap() {
    var imgOriObj = document.getElementById("imgOri");
    TR3.setMeshMap(imgOriObj, "contMeshMap");
  }
  initMap();
  init();
}

function leer_fichero(){
  var csv = null;
  var datos = (function () {
      $.ajax({
          'async': false,
          'global': false,
          'crossDomain': true,
          'url': './datos/datos.csv',
          'dataType': 'text',
          'success': function (data) {
              csv = data;
          }
      });
      return csv;
  })();

  var array_datos= csv.split("\n");
  return array_datos
}


function grafico_2d(array){

  var provincia_selected= document.getElementById("provincia").value
//  console.log(provincia_selected)
  //console.log('./datos/'+provincia_selected+"/"+estacion_selected+'.csv')
  var fecha_selected=document.getElementById("start").value
  fecha_selected=transformar_fecha(fecha_selected)
  //console.log(fecha_selected)
  var etiquetas=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
  var names=["CO","NO","NO2","O3","PM10","PM25","SO2"]


  var selected= []

  for (let i of array){
    if (i.includes(fecha_selected)){
      if (i.includes(provincia_selected)){
        selected.push(i)
      }
    }
  }
  var co=[]
  var no=[]
  var no2=[]
  var o3=[]
  var pm10=[]
  var pm25=[]
  var so2=[]
  var count = 24;
  for (let i of selected){
    if(count>0){
      var n=i.split(",");
      co.push(n[1])
      no.push(n[2])
      no2.push(n[3])
      o3.push(n[4])
      pm10.push(n[5])
      pm25.push(n[6])
      so2.push(n[7])
      count=count-1
    } else{
      break;
    }
  }


  //console.log(selected);

  const data = {
    labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
    datasets: [
      {
        label: 'CO',
        data: co,
        borderColor: "#0000FF",
      },
      {
        label: 'NO',
        data: no,
        borderColor: "#8A2BE2"
      },
      {
        label: 'NO2',
        data: no2,
        borderColor: "#DC143C",
      },
      {
        label: 'O3',
        data: o3,
        borderColor: "#006400",
      },
      {
        label: 'PM10',
        data: pm10,
        borderColor: "#FF8C00",
      },
      {
        label: 'PM25',
        data: pm25,
        borderColor: "#00CED1",
      },
      {
        label: 'SO2',
        data: so2,
        borderColor: "#FF00FF",
      },
    ]
  }

  if(myChart==null){
    myChart = new Chart(document.getElementById("line-chart"), {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Line Chart'
          }
        }
      },
    });
  } else {
    myChart.config.data = data;
    myChart.update();
  }
}

function valores_tamaño(array){
  var selected= []
  var selected_no_rep=[]
  var fecha_selected=document.getElementById("start").value
  fecha_selected=transformar_fecha(fecha_selected)
  var hora_selected=document.getElementById("hora").value
  var provincias=[]
  for (let i of array){
    if (i.includes(fecha_selected+" "+hora_selected)){
        selected.push(i)

    }
  }
  for(i=0; i<selected.length; i++){
    var n=selected[i].split(",")
    if (provincias.length!=0){
      var bandera=false
      for(j=0; j<provincias.length; j++){
        if(n[9]==provincias[j]){
          bandera=true
        }
      }
      if(bandera==false){
        provincias.push(n[9])
        selected_no_rep.push(selected[i])
      }

    }else{
      provincias.push(n[9])
      selected_no_rep.push(selected[i])
    }
  }


  console.log(selected_no_rep);

  return selected_no_rep
}


function transformar_fecha(fecha){
  var array_fecha=fecha.split("-")
  var fecha_fixed=array_fecha[2]+"/"+array_fecha[1]+"/"+array_fecha[0]
  return fecha_fixed
}

function init(){
  TR3.pintar_esferas();
}

function ordenar_values(values){
  console.log(values)
  var ordenados=[0,0,0,0,0,0,0,0,0]
  for(i=0; i<values.length; i++){

    var n=values[i].split(",")
    console.log(n[12])
    //console.log(n[9])
    switch (n[9]) {
      case 'León':
        ordenados[0]=parseFloat(n[12].replace(/\r?\n|\r/g, ""));
        break;
      case 'Palencia':
        ordenados[1]=parseFloat(n[12].replace(/\r?\n|\r/g, ""));
        break;
      case 'Burgos':
        ordenados[2]=parseFloat(n[12].replace(/\r?\n|\r/g, ""));
        break;
      case 'Soria':
        ordenados[3]=parseFloat(n[12].replace(/\r?\n|\r/g, ""));
        break;
      case 'Segovia':
        ordenados[4]=parseFloat(n[12].replace(/\r?\n|\r/g, ""));
        break;
      case 'Avila':
        ordenados[5]=parseFloat(n[12].replace(/\r?\n|\r/g, ""));
        break;
      case 'Salamanca':
        ordenados[6]=parseFloat(n[12].replace(/\r?\n|\r/g, ""));
        break;
      case 'Zamora':
        ordenados[7]=parseFloat(n[12].replace(/\r?\n|\r/g, ""));
        break;
      case 'Valladolid':
        ordenados[8]=parseFloat(n[12].replace(/\r?\n|\r/g, ""));
        break;

    }
  }
  console.log(ordenados)
  return ordenados

}

function seleccionar_color(entero){
  var color=""
  if (entero<25){
    color="green"
  }else if (entero>25 & entero<60){
    color="yellow"
  }else{
    color="red"
  }
  return color
}


function aux(prov,color){
  if (color=="green"){
    return "<h5>"+prov+": <span style='color:green;''>No preocupante</span>"
  }else if (color=="yellow"){
    return "<h5>"+prov+": <span style='color:yellow;'>Preocupante</span>"
  }else{
      return "<h5>"+prov+": <span style='color:red;'>Muy preocupante</span>"
  }
}
