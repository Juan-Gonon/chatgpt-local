import { WebWorkerMLCEngineHandler, MLCEngine } from "https://esm.run/@mlc-ai/web-llm";

// onmessage = (e) => {
//     console.log('Worker: Message received from main')
//     console.log(e);

//     if(e.data.name === 'hello'){
//         postMessage({name : 'back Hello'})
//     }
// }

const engine = new MLCEngine()
const handler = new WebWorkerMLCEngineHandler(engine)

onmessage = msg => {
    handler.onmessage(msg)
}

