import { useEffect, useRef, useState } from "react"

export default function Home() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([
        {
            role: 'user',
            content: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo temporibus, quasi laboriosam optio officiis corporis ea quisquam? Inventore minus vitae molestiae aliquid, fugit perspiciatis saepe, alias, eum eius voluptatibus asperiores.'
        },
        {
            role: 'ai',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo quas impedit facilis ex, inventore commodi consectetur fugit eum, placeat accusamus consequatur nostrum deserunt labore eligendi eaque dolorum totam! Quasi, omnis.'
        }
    ])
    const [isDisabled, setIsDisabled] = useState(false)

    const textAreaRef = useRef(null)
    const scrollRef = useRef(null)

    const sendMessage = async () => {
        if (!input.trim()) {
            return
        }

        const sleep = (ms) => (  // fake fetching by setting a timeout
            new Promise((resolve) => {
                setTimeout(resolve, ms)
            })
        )

        setIsDisabled(true)

        setMessages(prev => [
            ...prev,
            {
                role: 'user',
                content: input.trim()
            }
        ])
        setInput('')

        await sleep(3000)

        setMessages(prev => [
            ...prev,
            {
                role: 'ai',
                content: 'I ain\'t reading allat brotato chip lmfao!!! Just go talk to Gemini itself at this point xdddd'
            }
        ])

        setIsDisabled(false)
    }

    useEffect(() => {
        const e = textAreaRef.current
        e.style.height = 'auto'
        e.style.height = e.scrollHeight + 'px'
    }, [input])

    useEffect(() => {
        const e = scrollRef.current
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <>
            <h1>Our AI project</h1>
            <div
                style={{
                    flex: 1,
                    flexDirection: "column",
                    overflowY: 'auto',
                    backgroundColor: "#f5f5f5",
                    borderRadius: '15px',
                    padding: '10px',
                    display: 'flex',
                    gap: '15px'
                }}
            >
                {messages.map((e, i) => (
                    <div
                        key={i}
                        className={e.role === 'user' ? 'usermessage' : 'aimessage'}
                    >
                        <p>
                            {e.content}
                        </p>
                    </div>
                ))}
                <div
                    ref={scrollRef}
                />
            </div>
            <div
                style={{
                    padding: 10,
                    paddingBottom: '0px',
                    width: '100%',
                    boxSizing: "border-box",
                    overflow: 'hidden'
                }}
            >
                <form
                    style={{
                        display: "flex",
                        flexDirection: 'row',
                        gap: '10px',
                        paddingBottom: '5px'
                    }}
                    onSubmit={(e) => {
                        e.preventDefault() // removes reload, though might be useful with real api
                        sendMessage()
                    }}
                >
                    <textarea
                        style={{
                            width: '100%',
                        }}
                        rows={1}
                        ref={textAreaRef}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                e.target.form.requestSubmit()
                            }
                        }}
                        disabled={isDisabled}
                    />
                    <button
                        style={{
                            height: '50px',
                            alignSelf: "flex-start",
                            borderRadius: '10px',
                            borderWidth: "1px",
                            overflow: 'hidden',
                            padding: "15px"
                        }}
                        type="submit"
                        disabled={isDisabled}
                    >
                        Enter
                    </button>
                </form>
            </div>
        </>
    )
}