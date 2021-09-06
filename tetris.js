let canvas = document.getElementById('tetris');// grabs the cavas
let context = canvas.getContext('2d'); // for drawing

//makes the peices biffer scales it 20 by 20 pxl's
context.scale(20,20)

//draws the shapes 
let matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
];
// //collision detector
function collide(arena, player){
    const [m,o] = [player.matrix, player.pos];
    for(let y =0; y <m.length; ++y){
        for(let x = 0; x< m[y].length; ++x){
            if(m[y][x] !== 0 && 
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0)
            return true
        }
    }
    return false
}

// function collide(arena, player) {
//     const m = player.matrix;
//     const o = player.pos;
//     for (let y = 0; y < m.length; ++y) {
//         for (let x = 0; x < m[y].length; ++x) {
//             if (m[y][x] !== 0 &&
//                (arena[y + o.y] &&
//                 arena[y + o.y][x + o.x]) !== 0) {
//                 return true;
//             }
//         }
//     }
//     return false;
// }

function createMatrix(width, height) {
    const matrix =[]
    //matrix is filled with zeroes
    while(height--){matrix.push(new Array(width).fill(0))}
    return matrix
}

//the purpose of this function is to draw the grid continusly
function draw() {
    //paint the context
    //what this does in the draw function is allow the grid to cont, update and create a new grid based on the diffrent position values
    context.fillStyle = '#000'; //hex code for black -- style
    context.fillRect(0, 0, canvas.width, canvas.height) // 
    drawMatrix(arena, {x:0, y:0})
    drawMatrix(player.matrix, player.pos);
}
let dropCounter = 0;
let dropInterval = 1000;// miliseconds, every one second we want to drop a peice

//need to calculate time dependent things so we need to track the lastTime something moved
let lastTime = 0
//update function calls draw, then requestAnimation 
//time helps in getting the piece to drop -- default is zero
function update(time = 0) {
    ///--------------------------------------------------------This is counting on a second by second bases
    //change of time from begining to end
    const deltaTime = time - lastTime;
    //lastTime is cont updated with each milisecond
    lastTime = time;
    dropCounter += deltaTime;
    // when the drop count is gr8er than 1 sec the drop interval move the postion of y by 5 and then reset the couter
    if(dropCounter > dropInterval){
       playerDrop()
    }
    draw();
    requestAnimationFrame(update);
}

function playerDrop(){
    player.pos.y++;
    //if we drop and collide
    if(collide(arena,player)){
        player.pos.y--;
        merge(arena,player);
        player.pos.y = 0;
    }
    //reset counter
    dropCounter = 0; //the zero is inplace becasue we dont want an extra drop as the piece is falling
}

//draw the matrix and its pieces
//supports offset -- it allows us to move the pieces later
function drawMatrix(matrix,offset){
    //row and y index
    matrix.forEach((row, y) => {
        //value and x index
        row.forEach((val, x) =>{
            //drawing, we are skipping 0, which means this value 0 dont draw it
            if (val !== 0) {
                context.fillStyle = 'red'
                //fill x and y, and draw it with 1 width and height
                context.fillRect(x+ offset.x, y + offset.y,1,1)
            }
        });
    });
}
//player obj
let player = {
    pos:{x:5, y:5}, //move 5 x and 5 y
    matrix:matrix          
}

const arena = createMatrix(12,20)
console.table(arena)

//copy all the values from the player into the arena at correct position, the pieces from the mattrix will wind up here
function merge(arena, player){
    player.matrix.forEach((row, y) =>{
        row.forEach((value,x) => {
            if(value !== 0){ //values that are zero are ignored
                //copy the values into the arena at correct offset
                arena[y + player.pos.y][x + player.pos.x] = value
            }
        });
    });
}

//checks to see if the keyboard was triggered
document.addEventListener('keydown', event =>{
   if(event.keyCode === 37){player.pos.x--;} //left movement 
   else if (event.keyCode === 39){player.pos.x++;} //right movement
   else if (event.keyCode === 40){
       playerDrop()
   }
})
//continously draw the animations
update()