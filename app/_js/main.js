let loading = false;

function checkUser(){
  if(!localStorage.getItem('user')) {
    window.location.pathname = "/home.html"
  }
}

async function postRequest(router, data) {
  const registerName = await fetch(`https://mock-api.driven.com.br/api/v4/uol/${router}`, {
    method:'post',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({name: data})
  })
  return registerName;
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