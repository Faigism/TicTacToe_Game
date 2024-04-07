const playerOption = '❌'
const botOption = '⭕'
const boxes = Array.from({ length: 9 })
const p = document.querySelector('p')
const lineElement = document.createElement('div')
lineElement.classList.add('winning-line')
const you = document.getElementById('youId')
const comp = document.getElementById('compId')
let youScore = 0
let compScore = 0
// Blok seçiminin qarşısını almaq
document
  .querySelector('.game-container')
  .addEventListener('selectstart', function (e) {
    e.preventDefault()
  })
// Oyunu başlatmaq
document.querySelector('.game-board').addEventListener('mousedown', playerTurn)
// Yeniden başlatmaq
document.querySelector('button').addEventListener('click', resetGame)

const conditions = [
  { boxes: [0, 4, 8], transform: 'rotate(135deg)', left: '145px', top: '0px' },
  { boxes: [2, 4, 6], transform: 'rotate(225deg)', left: '145px', top: '0px' },
  { boxes: [0, 3, 6], transform: 'rotate(180deg)', left: '46px', top: '0px' },
  { boxes: [1, 4, 7], transform: 'rotate(180deg)', left: '145px', top: '0px' },
  { boxes: [2, 5, 8], transform: 'rotate(180deg)', left: '244px', top: '0px' },
  { boxes: [0, 1, 2], transform: 'rotate(90deg)', left: '144px', top: '-97px' },
  { boxes: [3, 4, 5], transform: 'rotate(90deg)', left: '144px', top: '0px' },
  { boxes: [6, 7, 8], transform: 'rotate(90deg)', left: '144px', top: '100px' },
]

function playerTurn(e) {
  const element = e.target
  if (
    element.textContent === playerOption ||
    element.textContent === botOption
  ) {
    return
  }
  element.textContent = playerOption
  boxes[element.id] = playerOption
  const winner = checkWinner(playerOption)
  if (!winner) {
    const emptyBoxes = boxes
      .map((box, index) => (box ? null : index))
      .filter((box) => box !== null)
    if (emptyBoxes.length === 0) {
      p.textContent = 'Oyun Bərabər Bitdi!'
      disableGameBoard()
      return
    }
    botTurn()
  }
}

function botTurn() {
  const move = getBestMove(boxes, botOption)
  boxes[move] = botOption
  document.getElementById(move).textContent = botOption
  const winner = checkWinner(botOption)
  if (!winner && boxes.filter((box) => box === undefined).length === 0) {
    p.textContent = 'Oyun Beraber Bitti!'
    return
  }
}

function checkWinner(option) {
  for (const condition of conditions) {
    const [a, b, c] = condition.boxes
    if (boxes[a] === option && boxes[b] === option && boxes[c] === option) {
      declareWinner(option, condition)
      return true
    }
  }
  return false
}

function declareWinner(option, condition) {
  const winnerText =
    option === playerOption ? 'Siz Qalib Gəldiniz...' : 'Bot Qalib Gəldi...'
  if (option !== playerOption) {
    comp.textContent = ++compScore
  } else {
    you.textContent = ++youScore
  }
  document.querySelector('p').textContent = winnerText
  lineElement.style.transform = condition.transform
  document.querySelector('.game-board').appendChild(lineElement)
  document.querySelector('.winning-line').style.left = condition.left
  document.querySelector('.winning-line').style.top = condition.top
  disableGameBoard()
}

function getBestMove(board, player) {
  let bestMove
  let bestScore = -Infinity
  for (let i = 0; i < board.length; i++) {
    if (board[i] === undefined) {
      board[i] = player
      let score = minimax(board, 0)
      board[i] = undefined
      if (score > bestScore) {
        bestScore = score
        bestMove = i
      }
    }
  }
  return bestMove
}

function minimax(board, testerBot) {
  const result = checkResult(board)
  if (result === botOption) {
    return 10
  } else if (result === playerOption) {
    return -10
  } else if (result === 'draw') {
    return 0
  }

  if (testerBot) {
    let bestScore = -Infinity
    for (let i = 0; i < board.length; i++) {
      if (board[i] === undefined) {
        board[i] = botOption
        const score = minimax(board, false)
        board[i] = undefined
        bestScore = Math.max(score, bestScore)
      }
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (let i = 0; i < board.length; i++) {
      if (board[i] === undefined) {
        board[i] = playerOption
        const score = minimax(board, true)
        board[i] = undefined
        bestScore = Math.min(score, bestScore)
      }
    }
    return bestScore
  }
}

function checkResult() {
  for (const condition of conditions) {
    const [a, b, c] = condition.boxes
    if (boxes[a] && boxes[a] === boxes[b] && boxes[b] === boxes[c]) {
      return boxes[a]
    }
  }

  let allBoxesFilled = true
  for (const box of boxes) {
    if (box === undefined) {
      allBoxesFilled = false
      break
    }
  }

  if (allBoxesFilled) {
    return 'draw'
  }

  return null
}

function resetGame() {
  boxes.fill(undefined)
  document.querySelectorAll('.box').forEach((box) => {
    box.textContent = ''
  })
  p.textContent = ''
  if (document.querySelector('.winning-line')) {
    document.querySelector('.winning-line').remove()
  }
  enableGameBoard()
}

function disableGameBoard() {
  document.querySelectorAll('.box').forEach((box) => {
    box.classList.add('disabled')
    document.querySelector('.game-board').style.pointerEvents = 'none'
  })
}

function enableGameBoard() {
  document.querySelectorAll('.box').forEach((box) => {
    box.classList.remove('disabled')
    document.querySelector('.game-board').style.pointerEvents = 'visible'
  })
}
