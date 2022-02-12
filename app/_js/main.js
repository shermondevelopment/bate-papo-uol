let loading = false
const messagesBox = document.querySelector('dl')

function checkUser(){
  if(!localStorage.getItem('user')) {
    window.location.pathname = "/home.html"
  }
}

async function postRequest(router, data) {
  const request = await fetch(`https://mock-api.driven.com.br/api/v4/uol/${router}`, {
    method:'post',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({name: data})
  })
  return request;
}

async function getRequest(router) {
  const request = await fetch(`https://mock-api.driven.com.br/api/v4/uol/${router}`)
  return await request.json()
}

async function sendForm(event) {
  event.preventDefault()
  enableLoading(true)
  const name = document.querySelector('input').value
  const { status } = await postRequest('participants', name)
  if(status === 200) {
    enableLoading(false)
    localStorage.setItem('user', name)
    window.location.href= "/"
  } else {
    enableLoading(false)
    showMessage()
  }
}

function enableLoading(loading) {
  const loadingElement = document.querySelector('.load-area')
  const formElement = document.querySelector('form')
  if(loading) {
    formElement.style.display = "none"
    loadingElement.classList.remove('not-loading')
  } else {
    formElement.style.display = "flex"
    loadingElement.classList.add('not-loading')
  }
}

function showMessage() {
  const message = document.querySelector('.message-warning');
  message.style.display = "block"
}

function templateEnterTheRoom(item) {
  return `
  <dt class="dt message-login d-flex align-items-center">
    <span>
      <strong class="strong">${item.from}</strong>
    </span>
    <img src="app/_img/login.svg" width="20" class="icon-login" />
    <span>Entrou</span>
    <span class="date-message"><time datetime="${item.time}">${item.time}</time></span>
  </dt>
  `
}

function templateMessageToEveryone(item) {
  return `
    <dt class="dt message-public">
    <span><strong class="strong">${item.from}</strong> para <strong class="strong">${item.to}:</strong> </span>
    ${item.text}
    <span class="date-message"><time datetime="${item.time}">${item.time}</time></span>
    </dt>
  `
}

function templatePrivateMessage(item) {
  return `
    <dt class="dt message-private">
      <span><strong class="strong">${item.from}</strong> reservadamente para <strong
          class="strong">${item.to}</strong></span>
      <span>${item.text}</span>
      <span class="date-message"><time datetime="${item.time}">${item.time}</time></span>
    </dt>
  `
}

function templateOwnMessages(item) {
  return `
    <dd class="dd message-me me align-self-end">
      <span><strong class="strong">${item.from}</strong> reservadamente para <strong
          class="strong">${item.to}</strong></span>&nbsp;
      <span>${item.text}</span>
      <span class="date-message"><time datetime="${item.time}">${item.time}</time></span>
    </dd>
  `
}

async function fetchMessage() {
  const messages = await getRequest('messages')
  console.log(messages)
  renderMessages(messages)
}

function renderMessages(messages) {
  messagesBox.innerHTML = "";
  messages.forEach( item => {
    if(item.type === 'status') {
      messagesBox.innerHTML += templateEnterTheRoom(item)
    } 
    else if (item.type === 'message' && item.to === 'Todos') {
      messagesBox.innerHTML += templateMessageToEveryone(item)
    } else if (item.type === 'message' && item.from === localStorage.getItem('user')) {
      messagesBox.innerHTML += templatePrivateMessage()
    } else if(item.type === 'message' && item.to === localStorage.getItem('user')) {
      messagesBox.innerHTML += templateOwnMessages(item)
    }
  } )
  document.querySelector('.dt:last-child').scrollIntoView()
}

setInterval(fetchMessage, 3000)