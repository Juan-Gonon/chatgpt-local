import {CreateMLCEngine} from "https://esm.run/@mlc-ai/web-llm";


const $ = el =>  document.querySelector(el)

const $form = $('form')
const $input = $('input')
const $template = $('#message-template')
const $messages = $('ul')
const $container = $('main')
const $info = $('small')
const $button = $('button')

let messages = []

const SELECTED_MODEL = 'gemma-2b-it-q4f32_1-MLC'

const engine = await CreateMLCEngine(SELECTED_MODEL, {

    initProgressCallback: (info) => {
        console.log('init', info)
        info.textContent = `${info.text}%`

        if(info.progress === 1){
            $button.removeAttribute('disabled')
        }

    }
})



$form.addEventListener('submit', async(e) => {
    e.preventDefault()

    const messageText = $input.value.trim()

    if(messageText !== ''){
        $input.value = ''
    }

    addMessage(messageText, 'user')

    $button.setAttribute('disabled', true)

    // setTimeout(() => {
    //     addMessage('Hola ¿cómo estás?', 'bot')

    //     $button.removeAttribute('disabled')
    // }, 2000)


    const userMessage = {
        role: 'user',
        content: messageText
    }

    messages.push(userMessage)

    const reply = await engine.chat.completions.create({
        messages
    })

    console.log(reply.choices[0].message)
    const botMessage = reply.choices[0].message
    messages.push(botMessage)
    addMessage(botMessage.content, 'bot')

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