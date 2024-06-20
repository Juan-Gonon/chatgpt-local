const $ = el =>  document.querySelector(el)

const $form = $('form')
const $input = $('input')
const $template = $('#message-template')
const $messages = $('ul')
const $container = $('main')
const $button = $('button')


$form.addEventListener('submit', (e) => {
    e.preventDefault()

    const messageText = $input.value.trim()

    if(messageText !== ''){
        $input.value = ''
    }

    addMessage(messageText, 'user')

    $button.setAttribute('disabled', true)

    setTimeout(() => {
        addMessage('Hola ¿cómo estás?', 'bot')

        $button.removeAttribute('disabled')
    }, 2000)

})

function addMessage(text, sender){
    const clonedTemplate = $template.content.cloneNode(true)
    const $newMessage = clonedTemplate.querySelector('.message')
    const $who = $newMessage.querySelector('span')
    const $text = $newMessage.querySelector('p')

    $text.textContent = text
    $who.textContent = sender === 'bot' ? 'GPT' : 'Tú'

    $newMessage.classList.add(sender)

    
    // actualizar el scroll
    
    $messages.appendChild($newMessage)
    
    $container.scrollTop = $container.scrollHeight

}