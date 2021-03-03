"use strict";

var canvas;
var gl;
var program;

var theta = 0.0;
var thetaLoc;
var direction = true;
var speed = 0.1;

var color = "Warm"
var warmColor;
var coolColor;

var vertices;
var program;
var verticesTriangle;
var programTriangle;


function loadAttributes(colorData) {
    //load up attributes for vertex and fragment shaders
    //load shaders and initialize attribute buffers
    //load the vertex data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    //associate our shader variables with out data bufferData
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    //color data
    let cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorData), gl.STATIC_DRAW);

    let colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );
    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(.9, .9, .9, 1.0);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vertices = [
        vec2(0, 1),
        vec2(-1, 0),
        vec2(1, 0),
        vec2(0, -1)
    ];

    verticesTriangle = [
        vec2(-1.0, -1.0),
        vec2(1.0, -1.0),
        vec2(0.0, 1.0)
    ];

    var warmColor = [
        vec3(1,.3,.7), //pink
        vec3(1,.3,0), //dark orange??
        vec3(.8,0,0), //red
        vec3(.9,.7,0)  //brighter orange

    ];

    var coolColor = [
        vec3(.3,0,1), //dark purple??
        vec3(0,.5,.6), //dark blue w green??
        vec3(0,.8,.5), //green w blue??
        vec3(0,1,.7) //light blue? green?
    ];

    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(warmColor), gl.STATIC_DRAW );
    
    let colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);


    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data bufferData

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    //set up uniform variable and establish shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    thetaLoc = gl.getUniformLocation(program, "uTheta");
    programTriangle = initShaders(gl, "vertex-shader-still", "fragment-shader");

    //set up color?
    loadAttributes(warmColor);

    // Initialize event handler (button)
    document.getElementById("Direction").onclick = function() {
        console.log("pressed button");
        direction = !direction;
    }

    //initalize event hangler (slider)
    document.getElementById("slider").onchange = function(event) {
        speed = parseFloat(event.target.value);
        console.log("slider!!!", speed);
    }

    document.getElementById("Controls").onclick = function(event) {
        switch(event.target.index) {
            case 0:
                color = "Warm";
                break;
            case 1:
                color = "Cool";
        }
    }

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw square
    gl.useProgram(program);

    //change speed for slider
    if (direction == true) {
        theta += speed;
    }
    else {
        theta -= speed;
    }

    //change color for menu
    if (color = "Warm"){
        loadAttributes(warmColor);
    }
    else {
        loadAttributes(coolColor);
    }


    gl.uniform1f(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}
