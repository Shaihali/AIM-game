const btnStart = document.querySelector('.btn-start')
const conteiner = document.querySelector('.conteiner')
const screens = document.querySelectorAll('.screen')
const btnTimes = document.querySelectorAll('.time-btn')
const time = document.querySelector('.time')
const board = document.querySelector('.board')
const colors = ['red', 'yellow', 'black', 'orange', 'blue', 'green', 'grey', 'silver', 'gold', 'violet', 'pink', 'white']
const scoreBoardBtn = document.querySelector('.scoreboard-btn')
const scoreBoard = document.querySelector('.scoreboard')

let timeX = 0
let score = 0
let interval = ""
let users = []



// Игрок нажимает кнопку Начать играть, затем переход на следующий screen
btnStart.addEventListener('click', (event) => {
	event.preventDefault()
	
	screenUp(0)
})


/* Выдается кнопки выбора времени игры, при нажатии на кнопку в переменную записывается цифра равная секунде времени выбранной играком + переход на следующий screen и старт игры +
 удаляем скрытость игрового блока */
btnTimes.forEach((item) => {
	item.addEventListener('click', (event) => {
		event.preventDefault()

		timeX = parseInt(event.target.innerText) 

		screenUp(1)

		board.classList.remove('hide') 

		startGame()	
	})
})


/* Клики на кружки, если мы кликаем именно на кружок, то в переменную добавляется одно очко и сразу удаляем кружок. Если кружок зеленый, то добавляются еще два кружка иначе один
 Если кружок красный, то уменьшает на одно очко */
board.addEventListener('click', (event) => {
	if(event.target.classList.contains('circle')) {
		if(event.target.style.background !== "red") {
			score++
			event.target.remove()
		}
		if(event.target.style.background === "green") {
			createRandomCircle(2)
			event.target.remove()
		}else createRandomCircle(1)
	}
	if(event.target.style.background === "red") {
		--score
		event.target.remove()
	}
})


scoreBoardBtn.addEventListener('click', () => {
	scoreBoardBtn.style.top = '-20px'
	scoreBoard.style.top = '6px'
	scoreBoard.style.transition = 'top 1.2s ease-out'
	getUsersInServer(scoreBoard)

	document.querySelector('.scoreboardExit').addEventListener('click', ()=> {
		scoreBoard.style.top = '-100vh'
		scoreBoardBtn.style.top = '14px'
		scoreBoard.style.transition = 'top 0.5s linear'
		document.querySelectorAll('.user-list, .score-list, .num-list').forEach((item)=> {
			item.remove()
		})
	})
})



// Функция старта игры + запускается интервал времени на каждую секунду + на старте выдаются два кружка + вызов функции которая заносит время в секундамер.
function startGame() {
	interval = setInterval(decreaseTime, 1000)
	createRandomCircle(2)
	setTime(timeX)

	return interval
}



// Функция поднятие страницы
function screenUp(index) {
	screens[index].classList.add('screen-up')
}


/* Функция которая уменьшает время на каждую секунду + Если время равна 00, то интервал отключается и игра заканчивается, иначе время уменьшается на 1 единицу + Если время меньше 10 секунд 
 то к времени добавляется спереди 0 иначе вызов функции которая заносит время в секундомер */
function decreaseTime() {
	if(timeX === 0) {
		clearInterval(interval)
		finishGame()
	}else {
		let currentTime = --timeX
	if(currentTime < 10) {
		currentTime = `0${currentTime}`
	}setTime(currentTime)
	}
}


//  Функция заносит время в разметку html для отображения
function setTime(value) {
	time.innerHTML = `00:${value}`
}


// Функция создает рандомно размер, местоположение и цвет кружков + ограничен игромым полем
function createRandomCircle(num) {
	for(let i = 0; i < num; i++) {
		const circle = document.createElement('div')
	circle.classList.add('circle')
	const {width, height} = board.getBoundingClientRect()
	const size = getRandomNumber(1, 60)

	circle.style.width = `${size}px`
	circle.style.height = `${size}px`
	circle.style.top = `${getRandomNumber(0, height - size)}px`
	circle.style.left = `${getRandomNumber(0, width - size)}px`
	circle.style.background = `${colors[getRandomColors()]}`

	board.append(circle)
	}
}


// Функция которая возвращает рандомно целые числа 
function getRandomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min)
}


// Функция которая возвращает рандомно целое число от 0 до длины массива цветов. 
function getRandomColors() {
	return Math.floor(Math.random() * colors.length)
}



/*Функция обработчик событий, которая выполняется после нажатия на кнопку ввода имени в поле input + скрывает игровое поле + находит input поле + создается объект 
 куда заносятся значение которое вводится в input поле и счет после игры + получает данные из локальной хранилище и добавляет в конец массива даннных если уже были данные до этого
  иначе добавляет в массив новые данные + удаляет табло счета с экрана + создает кнопку которая появляется в конце Повторить*/
function setUserName(e) {
	e.preventDefault()

	board.classList.add('hide')
	let userName = document.querySelector('.input-area')
	let user = {
		name: userName.value,
		score: score
	}

	postUsersInServer(user)

	board.children[0].remove()

	const repeatBtn = document.createElement('button')
	repeatBtn.classList.add('repeat-btn')
	repeatBtn.innerText = 'Повторить'
	screens[2].append(repeatBtn)

	let repeat = document.querySelector('.repeat-btn')
	repeat.addEventListener('click', () => {
		repeat.remove()
		screens[1].classList.remove('screen-up')
		board.classList.remove('hide')
		time.parentNode.classList.remove('hide')
		score = 0
	})
}



// Функция которая получает данные из локального хранилища + деструктуризация + создает доску лидеров и заносит в разметку данные имя и счет
// function getUsersInLeaderBoard() {
// JSON.parse(localStorage.getItem('myKey')).sort((a, b)=> b.score - a.score).forEach((obj)=> {
// 	const {name, score} = obj
// 	const leaderBoard = document.createElement('div')
// 	leaderBoard.classList.add('leader-board')
// 	leaderBoard.innerHTML = `${name}: ${score}`
// 	screens[2].append(leaderBoard)
// })
// }



// Функция отправление Post запроса на сервер и занесения данные о игроке и его счете.
// function postUsersInServer(obj) {
// 	xhr = new XMLHttpRequest()
// 	xhr.open('POST', 'https://628547d33060bbd34747b187.mockapi.io/api/postServer/users', true)
// 	xhr.setRequestHeader('Content-Type', 'application/json');
// 	xhr.send(JSON.stringify(obj))
// }
function postUsersInServer(obj) {
	fetch('https://628547d33060bbd34747b187.mockapi.io/api/postServer/users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(obj)
	})
}



async function getUsersInServer(boardScore) {
	let response = await fetch('https://628547d33060bbd34747b187.mockapi.io/api/postServer/users')
	let result = await response.json()
	let num = 1
	result.sort((a, b)=> b.score - a.score).forEach((obj)=> {
		const {name, score} = obj
		const userList = document.createElement('div')
		const scoreList = document.createElement('div')
		const numList = document.createElement('div')
		userList.classList.add('user-list')
		scoreList.classList.add('score-list')
		numList.classList.add('num-list')
		userList.innerHTML = `${name}`
		scoreList.innerHTML = ff(score)
		numList.innerHTML = `${num++}`
		boardScore.children[1].append(userList)
		boardScore.children[2].append(scoreList)
		boardScore.children[0].append(numList)
	})
}

function ff(score) {
	if(score > 5 || score === 0) {
		return `${score} <font size='1.8px'>очков</font>`
	}else if(score > 1 && score < 5) {
		return `${score} <font size='1.8px'>очка</font>`
	}else {
		return `${score} <font size='1.8px'>очко</font>`
	}
}



// Функция которая создает форму с импутом куда можно будет вносить имя игрока
function createForm() {
	const form = document.createElement('form')
	const inputAreaTitle = document.createElement('h1')
	const inputArea = document.createElement('input')
	const inputBtn = document.createElement('button')
	form.classList.add('form-user')
	inputArea.classList.add('input-area')
	inputArea.setAttribute('autofocus', '')
	inputBtn.classList.add('input-btn')
	inputBtn.innerText = 'Жми'
	inputAreaTitle.innerText = 'Ваше имя?'

	form.append(inputAreaTitle, inputArea, inputBtn)
	board.append(form)
}


/* Конец игры + скрывает время секундомера после конца игры + создает разметку в html куда выводится счет после игры на экране + Событие на клавитауру + если нажата кнопка энтер то
 скрывается табло со счетом и */
function finishGame() {
	time.parentNode.classList.add('hide')
	board.innerHTML = `<h1 class='score-title'>Счет: <span class="primary">${score}</span></h1>`

	document.addEventListener('keyup', (event)=> {
		event.preventDefault()
		if(event.code === 'Enter') {
			board.childNodes[0].remove()
			createForm()
		}else if(event.code === 'Escape') {
			location.reload()
		}
		if(event.target.classList.contains('input-area')){
			document.querySelector('.input-btn').addEventListener('click', setUserName)
		} 
		
	})
}







