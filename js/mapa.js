
	document.writeln("<script src=\"libs/three.min.js\"></script>");
	document.writeln("<script src=\"libs/OrbitControls.js\"></script>");
	document.writeln("<script src=\"libs/Detector.js\"></script>");

	TR3 = new Object();
	/*Scene Container*/
	TR3.scene; TR3.renderer; TR3.camera; TR3.controls; TR3.material; TR3.mesh; TR3.fov = 30;

	/*Maps Params*/
	TR3.srsImg; TR3.widthImg; TR3.heightImg;

	/*Container*/
	TR3.desty;
	TR3.canvasDestW; TR3.canvasDestH;
	TR3.optionsSet = {cursor3d: true, anaglyph: false};

	/*Esferas del diagrama*/

	TR3.arraySemiEsferas= [];


	TR3.animate = function(){

		if(TR3.optionsSet.anaglyph){
			effect.render(TR3.scene, TR3.camera);
		}else{
			TR3.renderer.render(TR3.scene, TR3.camera);
		}

		TR3.controls.update();
		//request new frame
		requestAnimationFrame( TR3.animate );
	};

	TR3.makeWorld = function(imgConteint){
		TR3.scene.add( new THREE.AmbientLight( 0xffffff, 0.7 ))
		TR3.widthImg = imgConteint.width;
		TR3.heightImg = imgConteint.height;

		/*Position Camera Ini*/
		var radianFOV = TR3.fov*2*Math.PI/360;
		TR3.camera.position.y = Math.cos(radianFOV/2)*(TR3.widthImg/2)/Math.sin(radianFOV/2)/1.5;
		TR3.camera.position.z = TR3.camera.position.y*Math.sin(Math.PI/4);

		/*Texture-Material*/
		var texture = new THREE.Texture(imgConteint);
		texture.needsUpdate = true;
		TR3.material = new THREE.MeshBasicMaterial({map: texture});

		/*Image-Mesh*/
		var geometry = new THREE.PlaneBufferGeometry( TR3.widthImg, TR3.heightImg );
		//geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
		TR3.mesh = new THREE.Mesh( geometry, TR3.material);
		//TR3.mesh.geometry.dynamic = true;
		TR3.mesh.name = "mesh3d";
		TR3.mesh.rotation.x = -Math.PI/2;
		TR3.scene.add(TR3.mesh);
	};

	TR3.cvsDesty = function(){

		var canvasDest = document.getElementById('canvasDest');
		if(!canvasDest){
			canvasDest = document.createElement('CANVAS');
			canvasDest.id = 'canvasDest';
			canvasDest.setAttribute("width", TR3.canvasDestW);
			canvasDest.setAttribute("height", TR3.canvasDestH);

			document.getElementById(TR3.desty).appendChild(canvasDest);
		}

		return canvasDest;
	};

	TR3.setMeshOptions = function(cursorOpt, anaglyphOpt){
		/*DTM*/
		var b4DTMopt = TR3.optionsSet.DTM;

		//if(DTMopt=="def"){DTMopt=false;}

		/*Cursor3d*/
		var cursorOpt = cursorOpt;

		if(cursorOpt=="def"){cursorOpt=true;}
		var infoGeo3d = document.getElementById('infoGeo3d');
		var cvsDesty = document.getElementById(TR3.desty)
		if( cursorOpt == true ){
			if(!infoGeo3d){
				infoGeo3d = document.createElement('div');
				infoGeo3d.id = "infoGeo3d";
				infoGeo3d.style.position = "absolute";
				infoGeo3d.style.top = 0;
				infoGeo3d.style.fontSize = "10px";
				infoGeo3d.style.margin = "5px";
				cvsDesty.appendChild(infoGeo3d);
			}else{
				infoGeo3d.style.display = 'block';
			}
			//cvsDesty.style.cursor = "none";
		}else{
			infoGeo3d.style.display = 'none';
			//cvsDesty.style.cursor = "auto";
		}

		/*Anaglyph*/
		var anaglyphOpt = anaglyphOpt;

		if(anaglyphOpt=="def"){anaglyphOpt=false;}

		TR3.optionsSet = {cursor3d: cursorOpt, anaglyph: anaglyphOpt};
	};

	TR3.divContainer = function(desty){

		var contMeshMap = document.getElementById(desty);
		if(!contMeshMap){
			alert("invalid destiny");
		}else{
			TR3.canvasDestW = parseInt(contMeshMap.style.width) || 500;
			TR3.canvasDestH = parseInt(contMeshMap.style.height) || 500;
			contMeshMap.style.position='relative';
		}
	};

	TR3.setMeshMap = function(imgOri,desty){

		/*INI params*/
		//imgOri = imgOri || 'http://www.ign.es/wms-inspire/pnoa-ma?&VERSION=1.1.1&REQUEST=GetMap&LAYERS=OI.OrthoimageCoverage&FORMAT=image/jpeg&SRS=EPSG:25830&BBOX=647399,4220032,649899,4222532&EXCEPTIONS=application/vnd.ogc.se_inimage&width=500&height=500';
		TR3.desty = desty || 'contMeshMap';
		TR3.setMeshOptions(true, false);

		/*Div container*/
		TR3.divContainer(desty);

		/*Detector Renderer*/
		if(Detector.canvas){
			/*Get canvas Destiny*/
			var canvasDest = TR3.cvsDesty();
			if ( ! Detector.webgl ) {
				alert("Your browser does not seem to support WebGL. Please, upgrade your browser or try another one.");
			}else{
				TR3.renderer = new THREE.WebGLRenderer({ canvas: canvasDest });
			}
		}else{
			alert("Your browser does not seem to support HTML5 canvas. Please, upgrade your browser or try another one.");
		};

		TR3.renderer.setSize( TR3.canvasDestW, TR3.canvasDestH );

		/*Scene*/
		TR3.scene = new THREE.Scene();

		/*Camera*/
		TR3.camera = new THREE.PerspectiveCamera(TR3.fov, TR3.canvasDestW / TR3.canvasDestH, 1, 20000);

		/*Orbit Controls*/
		TR3.controls = new THREE.OrbitControls( TR3.camera, canvasDest );
		//TR3.controls.center.set(0.0, 0.0, 0.0);
		TR3.controls.maxPolarAngle = Math.PI/2;
		TR3.controls.minPolarAngle = 0 + 0.05;
		TR3.controls.userPanSpeed = 100;
		TR3.controls.autoRotate = true;

		TR3.scene.background =  new THREE.Color( 0xffffff )

		/*Create Image-Mesh*/
		TR3.makeWorld( imgOri );

		/*Animate*/
		TR3.animate();

		/*Events*/
		window.addEventListener( 'resize', TR3.onWindowResize, false );
		canvasDest.addEventListener( 'click', function() {TR3.controls.autoRotate = false;}, false );
	};

	TR3.onWindowResize = function(){

		TR3.camera.aspect = TR3.canvasDestW / TR3.canvasDestH;
		TR3.camera.updateProjectionMatrix();

		TR3.renderer.setSize( TR3.canvasDestW, TR3.canvasDestH );
	};

	//Establecer dimensiones del mapa y del canvas que lo contiene
	TR3.redimensionar_mapa = function() {
		TR3.canvasDestW = 900;
		TR3.canvasDestH = 550;
		$("#contMeshMap").css("width", "700px")
		$("#contentchart").css("width", "calc(100% - 700px)")
		$("#mapa3d").css("width", "700px")
		TR3.setMeshMap(TR3.srsImg,TR3.desty)
	};




	TR3.pintar_esferas= function(){
		var tam=valores_tamaño(array)
		var ordenados=ordenar_values(tam)
		console.log(200*ordenados[2])
		//Eliminamos las esferas existentes
		for(var i=0;i<TR3.arraySemiEsferas.length;i++){
			TR3.scene.remove(TR3.arraySemiEsferas[i])
		}
		//Zamora
		var hemispherioPrueba= new THREE.SphereGeometry(150*ordenados[7], 32, 32, 0, 2*Math.PI, 0, Math.PI/2);
		var material = new THREE.MeshStandardMaterial({color: new THREE.Color(seleccionar_color(200*ordenados[7]))});
		var hemis = new THREE.Mesh(hemispherioPrueba, material);
		hemis.position.set(-220,0,0)
		TR3.arraySemiEsferas.push(hemis)
		TR3.scene.add(hemis);
		//Valladolid
		var hemispherioPrueba= new THREE.SphereGeometry(200*ordenados[8], 32, 32, 0, 2*Math.PI, 0, Math.PI/2);
		var material = new THREE.MeshStandardMaterial({color: new THREE.Color(seleccionar_color(200*ordenados[8]))});
		var hemis = new THREE.Mesh(hemispherioPrueba, material);
		hemis.position.set(-80,0,27)
		TR3.arraySemiEsferas.push(hemis)
		TR3.scene.add(hemis);
		//Salamanca
		var hemispherioPrueba= new THREE.SphereGeometry(200*ordenados[6], 32, 32, 0, 2*Math.PI, 0, Math.PI/2);
		var material = new THREE.MeshStandardMaterial({color: new THREE.Color(seleccionar_color(200*ordenados[6]))});
		var hemis = new THREE.Mesh(hemispherioPrueba, material);
		hemis.position.set(-260,0,160)
		TR3.arraySemiEsferas.push(hemis)
		TR3.scene.add(hemis);
		//Avila
		var hemispherioPrueba= new THREE.SphereGeometry(200*ordenados[5], 32, 32, 0, 2*Math.PI, 0, Math.PI/2);
		var material = new THREE.MeshStandardMaterial({color: new THREE.Color(seleccionar_color(200*ordenados[5]))});
		var hemis = new THREE.Mesh(hemispherioPrueba, material);
		hemis.position.set(-80,0,200)
		TR3.arraySemiEsferas.push(hemis)
		TR3.scene.add(hemis);
		//Segovia
		var hemispherioPrueba= new THREE.SphereGeometry(200*ordenados[4], 32, 32, 0, 2*Math.PI, 0, Math.PI/2);
		var material = new THREE.MeshStandardMaterial({color: new THREE.Color(seleccionar_color(200*ordenados[4]))});
		var hemis = new THREE.Mesh(hemispherioPrueba, material);
		hemis.position.set(55,0,100)
		TR3.arraySemiEsferas.push(hemis)
		TR3.scene.add(hemis);
		//Soria
		var hemispherioPrueba= new THREE.SphereGeometry(200*ordenados[3], 32, 32, 0, 2*Math.PI, 0, Math.PI/2);
		var material = new THREE.MeshStandardMaterial({color: new THREE.Color(seleccionar_color(200*ordenados[3]))});
		var hemis = new THREE.Mesh(hemispherioPrueba, material);
		hemis.position.set(280,0,10)
		TR3.arraySemiEsferas.push(hemis)
		TR3.scene.add(hemis);
		//Burgos
		var hemispherioPrueba= new THREE.SphereGeometry(200*ordenados[2], 32, 32, 0, 2*Math.PI, 0, Math.PI/2);
		var material = new THREE.MeshStandardMaterial({color: new THREE.Color(seleccionar_color(200*ordenados[2]))});
		var hemis = new THREE.Mesh(hemispherioPrueba, material);
		hemis.position.set(130,0,-120)
		TR3.arraySemiEsferas.push(hemis)
		TR3.scene.add(hemis);
		//Palencia
		var hemispherioPrueba= new THREE.SphereGeometry(200*ordenados[1], 32, 32, 0, 2*Math.PI, 0, Math.PI/2);
		var material = new THREE.MeshStandardMaterial({color: new THREE.Color(seleccionar_color(200*ordenados[1]))});
		var hemis = new THREE.Mesh(hemispherioPrueba, material);
		hemis.position.set(-30,0,-120)
		TR3.arraySemiEsferas.push(hemis)
		TR3.scene.add(hemis);
		//Leon
		var hemispherioPrueba= new THREE.SphereGeometry(200*ordenados[0], 32, 32, 0, 2*Math.PI, 0, Math.PI/2);
		var material = new THREE.MeshStandardMaterial({color: new THREE.Color(seleccionar_color(200*ordenados[0]))});
		var hemis = new THREE.Mesh(hemispherioPrueba, material);
		hemis.position.set(-200,0,-170)
		TR3.arraySemiEsferas.push(hemis)
		TR3.scene.add(hemis);



		document.getElementById("leon_etiqueta").innerHTML = aux("León",seleccionar_color(200*ordenados[0]));
		document.getElementById("palencia_etiqueta").innerHTML = aux("Palencia",seleccionar_color(200*ordenados[1]));
		document.getElementById("burgos_etiqueta").innerHTML = aux("Burgos",seleccionar_color(200*ordenados[2]));
		document.getElementById("soria_etiqueta").innerHTML = aux("Soria",seleccionar_color(200*ordenados[3]));
		document.getElementById("segovia_etiqueta").innerHTML = aux("Segovia",seleccionar_color(200*ordenados[4]));
		document.getElementById("avila_etiqueta").innerHTML = aux("Ávila",seleccionar_color(200*ordenados[5]));
		document.getElementById("salamanca_etiqueta").innerHTML = aux("Salamanca",seleccionar_color(200*ordenados[6]));
		document.getElementById("zamora_etiqueta").innerHTML = aux("Zamora",seleccionar_color(200*ordenados[7]));
		document.getElementById("valladolid_etiqueta").innerHTML = aux("Valladolid",seleccionar_color(200*ordenados[8]));

	}
