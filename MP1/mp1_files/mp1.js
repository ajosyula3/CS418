
/**
 * @file CS418 Interactive Computer Graphics MP1: Dancing Logo
 * @author Tai-Ying Chen <tychen2@eillinois.edu>  
 */

/** @global The WebGL context */
var gl;

/** @global The HTML5 canvas we draw on */
var canvas;

/** @global A simple GLSL shader program */
var shaderProgram;

/** @global The WebGL buffer holding the triangle */
var vertexPositionBuffer;

/** @global The WebGL buffer holding the vertex colors */
var vertexColorBuffer;

/**
 * Creates a context for WebGL
 * @param {element} canvas WebGL canvas
 * @return {Object} WebGL context
 */
function createGLContext(canvas) {
  var context = null;
  context = canvas.getContext("webgl");
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

/**
 * Loads Shaders
 * @param {string} id ID string for shader to load. Either vertex shader/fragment shader
 */
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

/**
 * Setup the fragment and vertex shaders
 */
function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor"); 
}

/**
 * Populate buffers with data
 */
function setupBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var triangleVertices = [
    // Blue: top
    -0.55, 0.45, 0.0,
    -0.55, 0.85, 0.0,
    -0.35, 0.45, 0.0,
    -0.55, 0.85, 0.0,
    -0.35, 0.45, 0.0,
    0, 0.85, 0.0,
    -0.35, 0.45, 0.0,
    0, 0.85, 0.0,
    0.35, 0.45, 0.0,
    0, 0.85, 0.0,
    0.35, 0.45, 0.0,
    0.55, 0.85, 0.0,
    0.35, 0.45, 0.0,
    0.55, 0.85, 0.0,
    0.55, 0.45, 0.0, 
    // Body
    -0.35, 0.45, 0.0,
    0.35, 0.45, 0.0,
    -0.35, 0.0, 0.0,
    0.35, 0.45, 0.0,
    -0.35, 0.0, 0.0,
    0.35, -0.45, 0.0,
    -0.35, 0.0, 0.0,
    0.35, -0.45, 0.0,
    -0.35, -0.45, 0.0,    
    // Bottom
    -0.55, -0.45, 0.0,
    -0.55, -0.85, 0.0,
    -0.35, -0.45, 0.0,
    -0.55, -0.85, 0.0,
    -0.35, -0.45, 0.0,
    0, -0.85, 0.0,
    -0.35, -0.45, 0.0,
    0, -0.85, 0.0,
    0.35, -0.45, 0.0,
    0, -0.85, 0.0,
    0.35, -0.45, 0.0,
    0.55, -0.85, 0.0,
    0.35, -0.45, 0.0,
    0.55, -0.85, 0.0,
    0.55, -0.45, 0.0,
    // Orange: top
    -0.5, 0.5, 0.0,
    -0.5, 0.8, 0.0,
    -0.3, 0.5, 0.0,
    -0.5, 0.8, 0.0,
    -0.3, 0.5, 0.0,
    0, 0.8, 0.0,
    -0.3, 0.5, 0.0,
    0, 0.8, 0.0,
    0.3, 0.5, 0.0,
    0, 0.8, 0.0,
    0.3, 0.5, 0.0,
    0.5, 0.8, 0.0,
    0.3, 0.5, 0.0,
    0.5, 0.8, 0.0,
    0.5, 0.5, 0.0, 
    // Body
    -0.3, 0.5, 0.0,
    0.3, 0.5, 0.0,
    -0.3, 0.0, 0.0,
    0.3, 0.5, 0.0,
    -0.3, 0.0, 0.0,
    0.3, -0.5, 0.0,
    -0.3, 0.0, 0.0,
    0.3, -0.5, 0.0,
    -0.3, -0.5, 0.0,    
    // Bottom
    -0.5, -0.5, 0.0,
    -0.5, -0.8, 0.0,
    -0.3, -0.5, 0.0,
    -0.5, -0.8, 0.0,
    -0.3, -0.5, 0.0,
    0, -0.8, 0.0,
    -0.3, -0.5, 0.0,
    0, -0.8, 0.0,
    0.3, -0.5, 0.0,
    0, -0.8, 0.0,
    0.3, -0.5, 0.0,
    0.5, -0.8, 0.0,
    0.3, -0.5, 0.0,
    0.5, -0.8, 0.0,
    0.5, -0.5, 0.0,      
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = triangleVertices.length / vertexPositionBuffer.itemSize;
    
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  var blue = [
    19/256, 41/256, 74/256, 1.0
  ];
  var orange = [
    234/256, 76/256, 39/256, 1.0
  ];
  var colors = [];
  for (var i = 0; i < vertexPositionBuffer.numberOfItems; i++) {
    if (i < vertexPositionBuffer.numberOfItems / 2) colors.push(...blue);
    else colors.push(...orange);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = vertexPositionBuffer.numberOfItems;   
}

/**
 * Draw call that applies matrix transformations to model and draws model in frame
 */
function draw() { 
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute)
                          
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
}

/**
 * Startup function called from html code to start program.
 */
 function startup() {
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders(); 
  setupBuffers();
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  draw();  
}

