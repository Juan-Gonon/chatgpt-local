import {CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm";


const $ = el =>  document.querySelector(el)

const $form = $('form')
const $input = $('input')
const $template = $('#message-template')
const $messages = $('ul')
const $container = $('main')
const $info = $('small')
const $button = $('button')

let messages = []

// if(window.Worker){
//     const worker = new Worker('/assets/js/workers.js')
//     worker.postMessage({name:'hello'})
//     worker.onmessage = (e)=>{
//         console.log('Main three: Message received from worker')
//         console.log(e)
//     }
// }

const SELECTED_MODEL = 'gemma-2b-it-q4f32_1-MLC'

const engine = await CreateWebWorkerMLCEngine(
    new Worker('/assets/js/workers.js', {type : 'module'}),
    SELECTED_MODEL, {

    initProgressCallback: (info) => {
        // console.log('init', info)
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

    $button.setAttribute('disabled', '')

    // setTimeout(() => {
    //     addMessage('Hola ¿cómo estás?', 'bot')

    //     $button.removeAttribute('disabled')
    // }, 2000)


    const userMessage = {
        role: 'user',
        content: messageText
    }

    messages.push(userMessage)

    const chunks = await engine.chat.completions.create({
        messages,
        stream: true
    })

    let reply = ''
    const $botMessage = addMessage('', 'bot')

    for await (const chunk of chunks){
        // console.log(chunk.choices)
        const choice = chunk.choices[0]
        const content = choice?.delta?.content ?? ''
        reply += content
        $botMessage.textContent = reply




    }

    $button.removeAttribute('disabled')

    // const botMessage = reply.choices[0].message
    messages.push({
        role : 'assistant',
        content: reply
    })
    // addMessage(botMessage.content, 'bot')
    $container.scrollTop = $container.scrollHeight

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

    return $text

}