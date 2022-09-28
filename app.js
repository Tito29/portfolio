const grid = document.querySelector(".grid")
const blockWidth = 100
const blockHeight = 20

const displayScore = document.querySelector('#score')

grid.style.left = '100px'

class Block {
    constructor(xAxis,yAxis){
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

var blocks = []
var userPos = []
function addBlocks(){
    let xPos = 10;
    let yPos = 270
    for(let i = 0; i < 15; i++){
        var block = document.createElement('div')
        block.classList.add('block')
        block.setAttribute('id', i)
        
        if(i == 2) 
            userPos = [xPos, 10] 
        
        if(i % 5 == 0 && i != 0){
            xPos = 10
            yPos = yPos - blockHeight - 10
        }
        blocks.push(new Block(xPos, yPos))

        xPos += blockWidth + 10
       
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] +'px'
        grid.appendChild(block)
        
    }
    
}
addBlocks()

var userBlock = new Block(userPos[0], userPos[1])
const user = document.createElement('div')
user.classList.add('user')

function createUser(){
    user.style.left = userPos[0] + 'px'
    user.style.bottom = userPos[1] + 'px'
    userBlock = new Block(userPos[0], userPos[1])
    grid.appendChild(user)
}
createUser()

var timerId 
var xDirection = 1
var yDirection = 1
var xRate = 5
var yRate = 5
var strikPos = 0
function moveUser(event){
    switch(event.key){
        case 'ArrowLeft':{
            if(userPos[0] > 0)
                userPos[0] -= 10
            createUser()
            if(reseted)
                reset()
            break
        }
        case 'ArrowRight':{
            if(userPos[0] < 460)
                userPos[0] += 10
            createUser() 
            if(reseted)
                reset()
            break
        }
        case 'r':{
            if(!reseted)
                reset()
            break
        }
        case ' ':{
            if(reseted){
                reseted = false
                timerId = setInterval(moveBall, 30)
                
            }
            break
        }
        default:{
            
        }
    }
}
document.addEventListener('keydown', moveUser)
var reseted = true
function reset(){
    ballLeftStart = userPos[0] + blockWidth/2 - 10
    ballBottomStart = userPos[1] + 20
    ballPos = [ballLeftStart, ballBottomStart] 
    xDirection = 1
    yDirection = 1
    xRate = ballSpeed + 1
    yRate = ballSpeed + 1
    strikPos = 0
    clearInterval(timerId)
    createBall()
    reseted = true
}

var ballLeftStart = userPos[0] + blockWidth/2 - 10
var ballBottomStart = userPos[1] + 20
var ballPos = [ballLeftStart, ballBottomStart]
const ball = document.createElement('div')
ball.classList.add('ball')

createBall()


function createBall(){
    
    //checkForCollision()
    ball.style.left = ballPos[0] +'px'
    ball.style.bottom = ballPos[1] + 'px'
    grid.appendChild(ball)
}

var ballSpeed = 5

function moveBall(){
    
    if(ballPos[0] >= 540){
        xDirection = -1
        xRate *= xDirection
    }
    if(ballPos[1] >= 280){
        yDirection = -1
        yRate *= yDirection
    }
    if(ballPos[0] <= 0){
        xDirection = -1
        xRate *= xDirection
    }

    if(((ballPos[0] + 20) >= userPos[0] && ballPos[0] <= userPos[0] + 100) && ((ballPos[1] <= userPos[1] + 20) && (ballPos[1] > userPos[1] + 10)) ){
        
        strikPos = (((ballPos[0] + 10) - userPos[0] - 50)/50) * ballSpeed
        let teta = Math.atan(1/strikPos)
        xRate = ballSpeed * Math.cos(teta)
        yRate = ballSpeed * Math.sin(teta)
        if(strikPos < 0){
            xRate *= -1
            yRate *= -1
        }
        console.log('teta: ', teta * (180/Math.PI))
        console.log('xRate: ', xRate)
        console.log('yRate: ', yRate)
        // if(strikPos <= 0){

        //     yRate = //(ballSpeed + 1) - (-1 * strikPos)
        //     xRate = xRate + (-1 * strikPos)
        //     if(xRate > 0)
        //         xRate *= -1
        // }else{
        //     yRate = (ballSpeed + 1) - strikPos
        //     xRate += strikPos
        //     if(xRate < 0)
        //         xRate *= -1
        // }
    }

    if(ballPos[1] <= 0){
        clearInterval(timerId)
        reseted = false
    }
    
    checkForCollision()
    ballPos[0] += xRate 
    ballPos[1] += yRate 
    createBall()
}

// let teta = Math.atan(-1)
// let tetaD = teta*(180/Math.PI)
// console.log(Math.cos(90-tetaD))
// console.log(Math.sin(90-tetaD))
// console.log(tetaD)

var score = 0
const maxScore = blocks.length

function checkForCollision(){
    
    //console.log(allBlocks[0])
    for(let i = 0; i < blocks.length; i++){
        if(((ballPos[0] + 20) >= blocks[i].bottomLeft[0] && ballPos[0] <= blocks[i].bottomRight[0]) && 
            (( ballPos[1] + 20) >= blocks[i].bottomLeft[1] &&  (ballPos[1]) <= blocks[i].topLeft[1])){
    
            var allBlocks = document.querySelectorAll('.block')
            allBlocks[i].remove()
            changeDirection(i, allBlocks)
            blocks.splice(i, 1)
            
            score++
            displayScore.textContent = score

            if(score == maxScore){
                setTimeout(congratulate, 100)
            }
        }
    }
}

function congratulate(){
    alert('Congratulations!! You Wone \n Your Score Is: ' + score)
    reset()
    return
}

function changeDirection(i, allBlocks){
    if(((ballPos[0] + 20) >= blocks[i].bottomLeft[0] && ((ballPos[0] + 10) < blocks[i].bottomLeft[0] + 20)) && 
        ((ballPos[1] +20) >= blocks[i].bottomLeft[1] && ballPos[1] <= blocks[i].topLeft[1])){
       
        xDirection = -1
        xRate *= xDirection
    }else if((ballPos[0] <= blocks[i].bottomRight[0] && (ballPos[0] >= blocks[i].bottomRight[0] - 20)) && 
        ((ballPos[1] + 20) >= blocks[i].bottomRight[1] && ballPos[1] <= blocks[i].topRight[1])){
        
        xDirection = -1
        xRate *= xDirection
    }else if((ballPos[0] >= blocks[i].bottomRight[0]) && (ballPos[1] >= blocks[i].bottomRight[1])){
        xDirection = -1
        xRate *= xDirection
    }else if(((ballPos[1] + 20) >= blocks[i].bottomLeft[1] && (ballPos[1] + 20) <= (blocks[i].bottomLeft[1] + 10)) && 
        (ballPos[0] >= blocks[i].bottomLeft[0] && ballPos[0] <= blocks[i].bottomRight[0])){

        yDirection = -1
        yRate *= yDirection
    }
    return
}