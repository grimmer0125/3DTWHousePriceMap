resizetext();

var mob = 0;

var sceneWidth = 200;

var valueFactor = 0.02;
var width = window.innerWidth;
var height = window.innerHeight;

var floatingDiv;

$(document).ready(function() {

    function cscale(t) {

        var jenkscolor = d3.scaleLinear()
            .domain([1401, 601, 487, 306, 174, 107, 61, 16, 0])
            .range([1, 0.87, 0.75, 0.62, 0.50, 0.37, 0.25, 0.12, 0.10]);

        return d3.interpolateInferno(jenkscolor(t));
    }

    function escale(t) {

        var emscale = d3.scaleLinear()
            .domain([1401, 601, 487, 306, 174, 107, 61, 16, 0])
            .range([1, 0.8, 0.6, 0.4, 0.2, 0.1, 0.05, 0.01, 0]);

        var finalscale = d3.scaleLinear()
            .domain([0, 1])
            .range(["black", cscale(t)]);

        return finalscale(emscale(t));
    }

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(20, width / height, 0.1, 1100);
    camera.position.set(0, -200, 400);
    var controls = new THREE.TrackballControls(camera);

    controls.minDistance = 30;
    controls.maxDistance = 1000;
    controls.rotateSpeed = 1;

    var renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    renderer.setSize(width, height);

    document.querySelector("#cv").appendChild(renderer.domElement);

    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(sceneWidth, 130, 10, 10),
        //new THREE.MeshLambertMaterial({color: "rgb(30,30,30)"})
        new THREE.MeshLambertMaterial({
            opacity: 1,
            transparent: true,
            color: "rgb(24,24,24)",
            emissive: "rgb(0,0,0)",
            side: THREE.DoubleSide
        })
    );
    scene.add(plane);

    var line_material = new THREE.LineBasicMaterial({
            color: 0x404040
        }),
        geometry = new THREE.Geometry(),
        floor = 0.1,
        step = 5;

    for (var i = 7; i <= 33; i++) {

        geometry.vertices.push(new THREE.Vector3(-100, floor, i * step - 100));
        geometry.vertices.push(new THREE.Vector3(100, floor, i * step - 100));
    }

    for (var i = 0; i <= 40; i++) {
        geometry.vertices.push(new THREE.Vector3(i * step - 100, floor, -65));
        geometry.vertices.push(new THREE.Vector3(i * step - 100, floor, 65));
    }

    var line = new THREE.LineSegments(geometry, line_material);
    line.rotation.x = Math.PI / 2;
    scene.add(line);

    var pointLight = new THREE.PointLight(0xFFFFFF, 2);
    pointLight.position.x = -300;
    pointLight.position.y = -100;
    pointLight.position.z = 300;

    scene.add(pointLight);

    var pointLight2 = new THREE.PointLight(0xFFFFFF, 0.4);
    pointLight2.position.x = 300;
    pointLight2.position.y = -100;
    pointLight2.position.z = 300;

    scene.add(pointLight2);

    controls.update();
    renderer.render(scene, camera);

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2(),
        INTERSECTED;

    d3.json("data/taiwan2.json", function(error, saved) {

        console.log("try to normalize:", saved);
        saved = extract(saved);
        console.log("new saved:", saved);

    // d3.json("usa-ppsqft.json", function(error, saved) {

        var temparr = [];

        // 單一地區, 共16xx個
        for (var i = 0; i < saved.actions.length; i++) {
            var ppsf = (saved.data[i].ppsf / 1401);
            var material = new THREE.MeshLambertMaterial({
                opacity: 1,
                transparent: true,
                color: cscale(saved.data[i].ppsf),
                emissive: escale(saved.data[i].ppsf),
                side: THREE.DoubleSide
            });


            //material.color = new THREE.Color(cscale(saved.data[i].ppsf));
            var shparr = [];

            // 通常 ii只有一個(一個zone通常是只有一個block, 沒有離島之類的), ii=0, cruves[i][0] = array of (x,y)
            for (var ii = 0; ii < saved.actions[i].length; ii++) {
                var actions = saved.actions[i][ii];
                var curves = saved.curves[i][ii];
                var shp = new THREE.Shape();
                shp.actions = actions;
                shp.curves = curves;
                shparr.push(shp)
            }

            shapeg1 = new THREE.ExtrudeGeometry(shparr, {
                amount: (20 + ppsf * 3000) * valueFactor,
                bevelEnabled: false
            });

            var shapeg1z = new THREE.BufferGeometry().fromGeometry(shapeg1);
            var shapeg2c = new THREE.Mesh(shapeg1z, material);


            shapeg2c.st = saved.data[i].st;
            shapeg2c.ct = saved.data[i].ct;
            shapeg2c.ppsf = saved.data[i].ppsf;


            scene.add(shapeg2c);
        }

        saved = null;

        requestAnimationFrame(animate);

        onWindowResize();
    });

    // begin: labels part

    var fontsizeg = 40;

    function makeTextSprite(message, parameters) {

        var scalefactor = 40;
        if (parameters === undefined) parameters = {};
        var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Helvetica"; //"Arial";
        var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
        var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
        var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : {
            r: 0,
            g: 0,
            b: 0,
            a: 1.0
        };
        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : {
            r: 255,
            g: 255,
            b: 255,
            a: 1.0
        };
        var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : {
            r: 0,
            g: 0,
            b: 0,
            a: 1.0
        };

        var canvas = document.createElement('canvas');
        canvas.style.width = "410px";
        canvas.style.height = "40px";
        //        canvas.style.background-color = "white";
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;
        var metrics = context.measureText(message);
        var textWidth = metrics.width;

        var basewidth = context.measureText("aaaaaaaaaaaaaa").width;
        var xstart = (basewidth - textWidth) / 2;


        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + 0 + ")";
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;

        //        roundRect(context, metrics.width, fontsize);
        roundRecto(context, borderThickness / 2, borderThickness / 2, (textWidth + borderThickness) * 1.2, fontsize * 1.4 + borderThickness, 8);

        context.strokeStyle = "rgb(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + ")";
        //        context.strokeText( message,  0, fontsize + borderThickness);

        context.strokeText(message, xstart, fontsize * 2.5);

        context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
        //        context.fillText( message,  0, fontsize + borderThickness);

        context.fillText(message, xstart, fontsize * 2.5);


        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial({
            map: texture
        }); //( { map: texture, useScreenCoordinates: false } );
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.5 * scalefactor, 0.25 * scalefactor, 0.75 * scalefactor);
        return sprite;
    }

    function roundRecto(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }


    function roundRect(ctx, w, h) {
        ctx.beginPath();
        ctx.lineWidth = "6";
        ctx.strokeStyle = "red";
        ctx.rect(0, 0, w, h);
        ctx.closePath();
        ctx.stroke();
    }


    //function addlabels() {

    var bufferz = 340;

    var spritey2 = makeTextSprite("San Francisco", {
        fontsize: fontsizeg,
        borderColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        },
        backgroundColor: {
            r: 20,
            g: 20,
            b: 20,
            a: 0.5
        },
        textColor: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        }
    });
    spritey2.position.set(-84, 9, (bufferz + (878 / 1400) * 3000) * valueFactor);
    scene.add(spritey2);

    spritey2 = makeTextSprite("New York", {
        fontsize: fontsizeg,
        borderColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        },
        backgroundColor: {
            r: 20,
            g: 20,
            b: 20,
            a: 0.5
        },
        textColor: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        }
    });
    spritey2.position.set(70, 17, (bufferz + (1397 / 1400) * 3000) * valueFactor);
    scene.add(spritey2);

    spritey2 = makeTextSprite("Honolulu", {
        fontsize: fontsizeg,
        borderColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        },
        backgroundColor: {
            r: 20,
            g: 20,
            b: 20,
            a: 0.5
        },
        textColor: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        }
    });
    spritey2.position.set(-42, -43, (bufferz + (490 / 1400) * 3000) * valueFactor);
    scene.add(spritey2);

    spritey2 = makeTextSprite("Boston", {
        fontsize: fontsizeg,
        borderColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        },
        backgroundColor: {
            r: 20,
            g: 20,
            b: 20,
            a: 0.5
        },
        textColor: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        }
    });
    spritey2.position.set(77, 26, (bufferz + (447 / 1400) * 3000) * valueFactor);
    scene.add(spritey2);

    spritey2 = makeTextSprite("Key West", {
        fontsize: fontsizeg,
        borderColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        },
        backgroundColor: {
            r: 20,
            g: 20,
            b: 20,
            a: 0.5
        },
        textColor: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        }
    });
    spritey2.position.set(58, -50, (bufferz + (405 / 1400) * 3000) * valueFactor);
    scene.add(spritey2);


    spritey2 = makeTextSprite("D.C.", {
        fontsize: fontsizeg,
        borderColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        },
        backgroundColor: {
            r: 20,
            g: 20,
            b: 20,
            a: 0.5
        },
        textColor: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        }
    });
    spritey2.position.set(63, 7, (bufferz + (477 / 1400) * 3000) * valueFactor);
    scene.add(spritey2);


    spritey2 = makeTextSprite("Los Angeles", {
        fontsize: fontsizeg,
        borderColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        },
        backgroundColor: {
            r: 20,
            g: 20,
            b: 20,
            a: 0.5
        },
        textColor: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        }
    });
    spritey2.position.set(-74, -9, (bufferz + (370 / 1400) * 3000) * valueFactor);
    scene.add(spritey2);

    spritey2 = makeTextSprite("Seattle", {
        fontsize: fontsizeg,
        borderColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        },
        backgroundColor: {
            r: 20,
            g: 20,
            b: 20,
            a: 0.5
        },
        textColor: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        }
    });
    spritey2.position.set(-70, 48, (bufferz + (292 / 1400) * 3000) * valueFactor);
    scene.add(spritey2);

    spritey2 = makeTextSprite("Aspen", {
        fontsize: fontsizeg,
        borderColor: {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        },
        backgroundColor: {
            r: 20,
            g: 20,
            b: 20,
            a: 0.5
        },
        textColor: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
        }
    });
    spritey2.position.set(-33, 5, (bufferz + (841 / 1400) * 3000) * valueFactor);
    scene.add(spritey2);

    //}


    spritey2 = null;

    d3.select("#labels").on("click", labelchg);
    labelchg();

    function labelchg() {

        var setval = false;
        var l = document.getElementById("labels");
        if (l.checked == true) {
            var setval = true
        }

        var labelarr = scene.children.slice().splice(4, 9);

        for (var k = 0; k < labelarr.length; k++) {
            labelarr[k].visible = setval;
        }

    }
    // end of label part

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        resizetext();
    }

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    function onDocumentMouseMove(event) {

        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    raycaster.setFromCamera(mouse, camera);

    function animate(time) {
        controls.update();
        renderer.render(scene, camera);

        raycaster.setFromCamera(mouse, camera);
        var cloneArray = scene.children.slice();

        //cloneArray.splice(0, 4);
        cloneArray.splice(0, 13);

        var intersects = raycaster.intersectObjects(cloneArray);

        if (intersects.length > 0 && mob == 0) {

            if (intersects[0].object.ct == "Barbour" || intersects[0].object.ct == "Aleutians East") {

                if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

                INTERSECTED = null;

            } else {

                if (INTERSECTED != intersects[0].object) {

                    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

                    INTERSECTED = intersects[0].object;
                    INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                    INTERSECTED.material.emissive.setHex(0x00bb00);

                }
            }
        } else {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = null;
        }

        hidePopover();

        if (INTERSECTED !== null) {
            if (mob == 0) {
                showPopover(INTERSECTED.st, INTERSECTED.ct, INTERSECTED.ppsf);
            }
        }

        requestAnimationFrame(animate);
    }
});

function showPopover(st, ct, ppsf) {

    $(".popover-title").text(ct + ", " + st);
    $(".ppsqft").html("Avg price: <strong>$" + Math.round(ppsf) + "</strong>");
}

function hidePopover(st, ct, ppsf) {

    $(".popover-title").text("Taiwan");
    $(".ppsqft").html("Avg price: <strong>$∞</strong>");
}

function resizetext() {

    var wiw = window.innerWidth;
    if (wiw < 800) {
        $(".popover-title").css("font-size", "20px").css("margin-top", "18px");
        $(".ppsqft").css("font-size", "16px");
        $(".popover-content").css("margin-top", "14px");
    }
    if (wiw < 600) {
        $(".popover-title").css("font-size", "12px").css("margin-top", "8px");
        $(".ppsqft").css("font-size", "10px");
        $(".popover-content").css("margin-top", "6px");
    }
    if (wiw > 800) {

        $(".popover-title").css("font-size", "28px").css("margin-top", "28px");
        $(".ppsqft").css("font-size", "22px");
        $(".popover-content").css("margin-top", "18px");
        $(".fafa").css("border-radius", "30px").css("height", "30px").css("line-height", "30px").css("width", "30px").css("font-size", "20px");

    }
    if (wiw < 670) {
        $(".popover").css("display", "none");
        mob = 1;
        $(".fafa").css("border-radius", "30px").css("height", "30px").css("line-height", "30px").css("width", "30px").css("font-size", "20px");
        $(".close").css("font-size", "12pt");
        $(".floating").css("font-size", "10pt");
    }
    if (wiw > 670) {
        $(".popover").css("display", "initial");
        mob = 0;
        $(".fafa").css("border-radius", "40px").css("height", "40px").css("line-height", "40px").css("width", "40px").css("font-size", "26px");
        $(".close").css("font-size", "15pt");
        $(".floating").css("font-size", "12pt");
    }
}

function about() {
    document.querySelector("#floating").style.display = 'block';
}

function closeabout() {
    document.querySelector("#floating").style.display = 'none';
}
