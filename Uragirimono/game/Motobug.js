import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'
import { Enemigo } from './Enemigo.js'
import * as TWEEN from '../libs/tween.esm.js';


class Motobug extends Enemigo {
    constructor(escena, vidas, bordes, id) {
        super(escena, vidas, bordes);
        this.identificador = id;
        this.ultimaPosicion = new THREE.Vector3(20, 0, 0);
        this.geometrias = [];
        this.materiales = [];
        this.escaladoOriginal = 0.5;
        this.figura = new THREE.Object3D();
        // la rueda
        var ruedaGeo = new THREE.TorusGeometry(5, 2.75, 16, 15);
        var texturaRueda = new THREE.TextureLoader().load("../imgs/tire.jpg");
        texturaRueda.wrapS = THREE.RepeatWrapping;
        texturaRueda.wrapT = THREE.RepeatWrapping;
        texturaRueda.repeat.set(1, 1);
        var ruedaMat = new THREE.MeshToonMaterial({ color: "grey", map: texturaRueda });

        this.rueda = new THREE.Mesh(ruedaGeo, ruedaMat);
        this.velocidadRueda = 0.05;

        this.geometrias.push(ruedaGeo);
        this.materiales.push(ruedaMat);

        // el cuerpo

        var curvaCuerpo = new THREE.EllipseCurve(
            0, 0,
            5, 5,
            -Math.PI, 0,
            true,
            0
        )
        var puntos2d = curvaCuerpo.getPoints(15);
        var formaCuerpo = new THREE.Shape(puntos2d);
        var puntos3d = [];
        puntos2d.forEach(p => {
            puntos3d.push(new THREE.Vector3(p.x, p.y, 0));
        });
        var path = new THREE.CatmullRomCurve3(puntos3d);
        var cuerpoGeo = new THREE.ExtrudeGeometry(formaCuerpo, { extrudePath: path, steps: 50 });
        var cuerpoMat = new THREE.MeshToonMaterial({ color: 0xe6202a });
        var cuerpoCentral = new THREE.Mesh(cuerpoGeo, cuerpoMat);

        var cuerpoLatGeo = new THREE.BoxGeometry(10, 5, 9, 1, 1, 1);
        cuerpoLatGeo.translate(0, 2.5, 0);
        var cuerpoLat = new THREE.Mesh(cuerpoLatGeo, cuerpoMat);

        var cuerpo = new CSG();
        cuerpo.union([cuerpoCentral, cuerpoLat]);
        this.cuerpoFinal = cuerpo.toMesh();

        this.geometrias.push(cuerpoGeo);
        this.geometrias.push(cuerpoLatGeo);
        this.materiales.push(cuerpoMat);

        // la cabezaa
        var pathCabeza = new THREE.EllipseCurve(
            0, 0,
            5.5, 5.5,
            Math.PI / 3, 0.2,
            true,
            0
        )
        puntos2d = pathCabeza.getPoints(20);
        var formaCabeza = new THREE.Shape(curvaCuerpo.getPoints(15));
        puntos3d = [];
        puntos2d.forEach(p => {
            puntos3d.push(new THREE.Vector3(p.x, p.y, 0));
        });
        path = new THREE.CatmullRomCurve3(puntos3d);
        var cabezaGeo = new THREE.ExtrudeGeometry(formaCabeza, { extrudePath: path, steps: 50 });
        var cabezaMat = new THREE.MeshToonMaterial({ color: 0x037bfc });
        this.cabeza = new THREE.Mesh(cabezaGeo, cabezaMat);

        this.geometrias.push(cabezaGeo);
        this.materiales.push(cabezaMat);

        // las manchas negras

        var decoGeo1 = new THREE.CylinderGeometry(2, 2, 0.75, 6, 6);
        var decoMat = new THREE.MeshToonMaterial({ color: 0x333232 });
        decoGeo1.rotateX(Math.PI / 3);
        decoGeo1.translate(0, 7.5, 4.5);
        this.deco1 = new THREE.Mesh(decoGeo1, decoMat);


        var decoGeo2 = new THREE.CylinderGeometry(2, 2, 0.75, 6, 6);
        decoGeo2.rotateX(-Math.PI / 3);
        decoGeo2.translate(0, 7.5, -4.5);
        this.deco2 = new THREE.Mesh(decoGeo2, decoMat);

        var decoGeo3 = new THREE.CylinderGeometry(2, 2, 0.75, 6, 6);
        decoGeo3.rotateX(Math.PI / 4);
        decoGeo3.rotateZ(Math.PI / 2);
        decoGeo3.rotateX(-Math.PI / 5);
        decoGeo3.translate(-8, 4, 3);
        this.deco3 = new THREE.Mesh(decoGeo3, decoMat);

        var decoGeo4 = new THREE.CylinderGeometry(2, 2, 0.75, 6, 6);
        decoGeo4.rotateX(-Math.PI / 4);
        decoGeo4.rotateZ(Math.PI / 2);
        decoGeo4.rotateX(Math.PI / 5);
        decoGeo4.translate(-8, 4, -3);
        this.deco4 = new THREE.Mesh(decoGeo4, decoMat);

        this.decoraciones = new THREE.Group();
        this.decoraciones.add(this.deco1);
        this.decoraciones.add(this.deco2);
        this.decoraciones.add(this.deco3);
        this.decoraciones.add(this.deco4);

        this.geometrias.push(decoGeo1);
        this.geometrias.push(decoGeo2);
        this.geometrias.push(decoGeo3);
        this.geometrias.push(decoGeo4);
        this.materiales.push(decoMat);


        // los ojos
        var ojoGeo1 = new THREE.SphereGeometry(1.5, 5, 5);
        ojoGeo1.translate(8, 6, -2);
        var ojoMat = new THREE.MeshToonMaterial({ color: "white" });
        this.ojo1 = new THREE.Mesh(ojoGeo1, ojoMat);

        var ojoGeo2 = new THREE.SphereGeometry(1.5, 5, 5);
        ojoGeo2.translate(8, 6, 2);
        this.ojo2 = new THREE.Mesh(ojoGeo2, ojoMat);

        var pupGeo1 = new THREE.SphereGeometry(.5, 5, 5);
        pupGeo1.translate(9.5, 6, -2);
        var pupMat = new THREE.MeshToonMaterial({ color: "black" });
        this.pup1 = new THREE.Mesh(pupGeo1, pupMat);

        var pupGeo2 = new THREE.SphereGeometry(.5, 5, 5);
        pupGeo2.translate(9.5, 6, 2);
        this.pup2 = new THREE.Mesh(pupGeo2, pupMat);

        this.geometrias.push(ojoGeo1);
        this.geometrias.push(ojoGeo2);
        this.geometrias.push(pupGeo1);
        this.geometrias.push(pupGeo2);
        this.materiales.push(ojoMat);
        this.materiales.push(pupMat);


        // los "dientes"

        var dienteShape = new THREE.Shape();
        dienteShape.moveTo(1, 0);
        dienteShape.lineTo(0, -3);
        dienteShape.lineTo(-1, 0);
        var dienteGeo1 = new THREE.ExtrudeGeometry(dienteShape, { depth: .5 });
        dienteGeo1.rotateY(Math.PI / 2);
        dienteGeo1.translate(10, 3, -2);
        dienteGeo1.rotateX(Math.PI / 5);
        this.diente1 = new THREE.Mesh(dienteGeo1, ojoMat);

        var dienteGeo2 = new THREE.ExtrudeGeometry(dienteShape, { depth: .5 });
        dienteGeo2.rotateY(Math.PI / 2);
        dienteGeo2.translate(10, 3, 2);
        dienteGeo2.rotateX(-Math.PI / 5);
        this.diente2 = new THREE.Mesh(dienteGeo2, ojoMat);

        this.geometrias.push(dienteGeo1);
        this.geometrias.push(dienteGeo2);


        // los tubos de escape
        var tuboGeo1 = new THREE.CylinderGeometry(1, 1, 5, 6, 6);
        var tuboMat = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load("../imgs/tubo.jpg") });
        tuboGeo1.rotateZ(-Math.PI / 2 - Math.PI / 6);
        tuboGeo1.translate(-8, 3, -5);
        this.tubo1 = new THREE.Mesh(tuboGeo1, tuboMat);

        var tuboGeo2 = new THREE.CylinderGeometry(1, 1, 5, 6, 6);
        tuboGeo2.rotateZ(-Math.PI / 2 - Math.PI / 6);
        tuboGeo2.translate(-8, 3, 5);
        this.tubo2 = new THREE.Mesh(tuboGeo2, tuboMat);

        this.geometrias.push(tuboGeo1);
        this.geometrias.push(tuboGeo2);
        this.materiales.push(tuboMat);


        // los brazos
        var brazoGeo1 = new THREE.CylinderGeometry(0.5, 0.5, 5, 6, 6);
        brazoGeo1.rotateX(Math.PI / 2);
        brazoGeo1.translate(2, 3, 4);
        var brazoMat = new THREE.MeshToonMaterial({ color: "yellow" });
        this.brazo1 = new THREE.Mesh(brazoGeo1, brazoMat);

        var brazoGeo2 = new THREE.CylinderGeometry(0.5, 0.5, 5, 6, 6);
        brazoGeo2.rotateX(Math.PI / 2);
        brazoGeo2.translate(2, 3, -4);
        this.brazo2 = new THREE.Mesh(brazoGeo2, brazoMat);

        this.geometrias.push(brazoGeo1);
        this.geometrias.push(brazoGeo2);
        this.materiales.push(brazoMat);

        // añadir al objeto

        this.figura.add(this.rueda);
        this.figura.add(this.cuerpoFinal);
        this.figura.add(this.cabeza);
        this.figura.add(this.ojo1);
        this.figura.add(this.ojo2);
        this.figura.add(this.pup1);
        this.figura.add(this.pup2);
        this.figura.add(this.decoraciones);
        this.figura.add(this.diente1);
        this.figura.add(this.diente2);
        this.figura.add(this.tubo1);
        this.figura.add(this.tubo2);
        this.figura.add(this.brazo1);
        this.figura.add(this.brazo2);

        this.figura.rotateY(-Math.PI / 2);
        this.add(this.figura);


        this.scale.set(0.5, 0.5, 0.5)
        this.figura.translateY(3.75);

        // caja para las colisiones
        this.caja = new THREE.Mesh(
            new THREE.BoxGeometry(18, 13, 18),
            new THREE.MeshNormalMaterial({ transparent: true, opacity: 0 })
        )
        this.caja.name = "cajaMotobug";
        this.figura.add(this.caja);
        this.geometrias.push(this.caja.geometry);
        this.materiales.push(this.caja.material);


        // movimiento
        this.tocaNuevaRuta = false;
        this.movimiento = new TWEEN.Tween();
        this.generarNuevaRuta();


    }

    generarNuevaRuta() {
        var puntos = [
            new THREE.Vector3(this.rng(-90, 90), 2, this.rng(-90, 90)),
            new THREE.Vector3(this.rng(-90, 90), 2, this.rng(-90, 90)),
            new THREE.Vector3(this.rng(-90, 90), 2, this.rng(-90, 90)),
            new THREE.Vector3(this.rng(-90, 90), 2, this.rng(-90, 90)),
            new THREE.Vector3(this.rng(-90, 90), 2, this.rng(-90, 90)),
        ]

        var ruta = new THREE.CatmullRomCurve3(puntos, true);
        var escalado = this.escaladoOriginal;
        console.log(this.escaladoOriginal)
        var oEscDes = { e: escalado };
        var dEscDes = { e: 0 };
        var desaparece = new TWEEN.Tween(oEscDes)
            .to(dEscDes, 500)
            .onUpdate(() => {
                this.scale.set(oEscDes.e, oEscDes.e, oEscDes.e);
                console.log(`${this.identificador}::` + "me hago chiquito: ", oEscDes.e)
                this.figura.rotation.y += 0.1;
            })

        var oEscApa = { e: 0 };
        var dEscApa = { e: this.escaladoOriginal };
        var aparece = new TWEEN.Tween(oEscApa)
            .to(dEscApa, 500)
            .onStart(() => {
                this.position.copy(puntos[0]);
            })
            .onUpdate(() => {
                console.log(`${this.identificador}::` + "me hago grande: ", oEscApa.e)
                this.scale.set(oEscApa.e, oEscApa.e, oEscApa.e);
                this.figura.rotation.y += 0.1;
            })
            .onComplete(() => {
                this.figura.rotation.y = -Math.PI / 2;
            })


        var origen = { p: 0 };
        var destino = { p: 1 };

        this.movimiento = new TWEEN.Tween(origen)
            .to(destino, Math.random() * 10000 + 15000)
            .onStart(() => {
                this.tocaNuevaRuta = false;
            })
            .easing(TWEEN.Easing.Linear.None);

        this.movimiento.onUpdate(() => {
            if (!this.estoyMuerto()) {
                var t = origen.p;
                var posicion = ruta.getPointAt(t);
                this.position.copy(posicion);
                for (var i = 0; i < this.borders.length && !this.tocaNuevaRuta; i++) {
                    var borde = this.borders[i];
                    if (this.interseccionBorde(borde)) {
                        this.position.copy(this.ultimaPosicion);
                        this.tocaNuevaRuta = true;
                    }
                }
                if (!this.tocaNuevaRuta) {
                    this.ultimaPosicion.copy(this.position);
                    var tangente = ruta.getTangentAt(t);
                    posicion.add(tangente);
                    this.lookAt(posicion);
                }
            }
        })
            .onComplete(() => {
                this.tocaNuevaRuta = true;
            })

        desaparece.chain(aparece);
        aparece.chain(this.movimiento);
        desaparece.start();
    }

    rng(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1))
    }

    morir() {
        console.log("me muero...");
        super.morir();
        this.velocidadRueda = 0;
    }

    interseccionBorde(borde) {
        if (borde.name === "columna") {
            var vectorEntreObj = new THREE.Vector2();
            var v_caja = new THREE.Vector3();
            var v_borde = new THREE.Vector3();
            borde.getWorldPosition(v_borde);
            this.caja.getWorldPosition(v_caja);
            vectorEntreObj.subVectors(new THREE.Vector2(v_caja.x, v_caja.z),
                new THREE.Vector2(v_borde.x, v_borde.z));
            // console.log(`Distancia con ${borde.name}: ${vectorEntreObj.length()}`);
            return (vectorEntreObj.length() < 15); // se puede revisar
        }
    }

    update() {
        if (!this.estoyMuerto()) {
            this.rueda.rotation.z -= this.velocidadRueda;
            if (this.tocaNuevaRuta) {
                this.movimiento.stop();
                console.log(`${this.identificador} :: Generando ruta nueva`)
                this.generarNuevaRuta();
                this.tocaNuevaRuta = false;
            }
        }
    }
}

export { Motobug }