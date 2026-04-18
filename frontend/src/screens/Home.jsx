import { useEffect, useRef, useState } from "react"

export default function Home() {
    const [mode, setMode] = useState('explain')
    const sessionId = useRef(Math.random().toString(36).slice(2))
    const bottomRef = useRef(null)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [isDisabled, setIsDisabled] = useState(false)

    const ref = useRef(null)

    const sendMessage = async () => {
    if (!input.trim()) return

    setIsDisabled(true)
    setMessages(prev => [...prev, { role: 'user', content: input.trim() }])
    setInput('')

    try {
        const res = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionId.current,
                message: input.trim(),
                mode: mode
            })
        })
        const data = await res.json()
        setMessages(prev => [...prev, { role: 'ai', content: data.response }])
    } catch (err) {
        setMessages(prev => [...prev, { role: 'ai', content: 'Error connecting to backend.' }])
    }

    setIsDisabled(false)
}

    useEffect(() => {
        const e = ref.current
        e.style.height = 'auto'
        e.style.height = e.scrollHeight + 'px'
    }, [input])

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
                        ref={ref}
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