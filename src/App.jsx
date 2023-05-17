// realizando as importações
import { useState } from 'react'
import { Configuration, OpenAIApi } from 'openai'

// definindo os parâmetro de configuração
const configuration = new Configuration({
  organization: "org-t6BwUzuqlcGVSy5gFfQdmWs8",
  apiKey: "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"
})

// inicializando a instância do OpenAI API
const openai = new OpenAIApi(configuration)

function App() {
  // criando os estados 
  // 'message' vai conter a informação enviada
  // do 'app' para a 'api'
  const [ message, setMessage ] = useState("")
  // 'chat' será um 'array' que manterá as
  // mensagens enviadas por ambas as partes
  const [ chats, setChats ] = useState([])
  // 'isTyping' vai notificar o usuário se
  // o 'bot' está digitando ou não
  const [ isTyping, setIsTyping ] = useState(false)
  
  const chat = async(e,message) => {
    // prevenindo qualquer evento padrão
    e.preventDefault()

    // testando se não há mensagem enviada
    if (!message) return
    // caso haja mensagem enviada
    setIsTyping(true)

    // criando uma variável para receber o 'chat'
    let msgs = chats
    // inserindo cada mensagem no 'array'
    msgs.push({
      role: "user",
      content: message
    })
    // enviando as mensagems para o 'array chat'
    setChats(msgs)
    // limpando a mensagem
    setMessage("")

    // consumindo a 'api'
    openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "Mensagem de Teste!"
        },
        ...chats
      ]
      })
      .then((res) => {
        msgs.push(res.data.choices[0].message)
        setChats(msgs)
        setIsTyping(false)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <main>
      <h1>ChatGPT com React</h1>
      
      <section>
        {chats && chats.length ? chats.map((chat,index) => (
          <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
            <span>
              <b>{chat.role.toUpperCase()}</b>
            </span>
            <span>:</span>
            <span>{chat.content}</span>
          </p>
        ))
      : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>
            {isTyping ? "Digitando..." : ""}
          </i>
        </p>
      </div>

      <form action="" onSubmit={(e) => chat(e,message)}>
        <input 
          type="text"
          name="message"
          value={message}
          placeholder="Digite uma mensagem e pressione Enter..."
          onChange={(e) => setMessage(e.target.value)
          }
        />
      </form>

    </main>
  )
}

export default App