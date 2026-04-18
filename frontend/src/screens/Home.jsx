import { useEffect, useRef, useState } from "react"

export default function Home() {
    const [mode, setMode] = useState('explain')
    const sessionId = useRef(Math.random().toString(36).slice(2))
    const bottomRef = useRef(null)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [isDisabled, setIsDisabled] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [darkMode, setDarkMode] = useState(false)
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

    const uploadFile = async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch(`http://localhost:8000/upload?session_id=${sessionId.current}`, {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (data.message) {
                setUploadedFile(file.name)
                setMessages(prev => [...prev, { role: 'ai', content: `✅ File "${file.name}" uploaded! You can now ask me questions about it.` }])
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Error uploading file.' }])
        }
    }

    useEffect(() => {
        const e = ref.current
        e.style.height = 'auto'
        e.style.height = e.scrollHeight + 'px'
    }, [input])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    }, [darkMode])

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
                <div style={{ width: '80px' }} />
                <h1 style={{ margin: '32px 0' }}>Our AI project</h1>
                <button
                    onClick={() => setDarkMode(prev => !prev)}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        color: 'var(--text)',
                        width: '80px'
                    }}
                >
                    {darkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', padding: '8px 0', justifyContent: 'center' }}>
                <button
                    onClick={() => setMode('explain')}
                    style={{
                        background: mode === 'explain' ? 'var(--accent)' : 'transparent',
                        color: mode === 'explain' ? 'white' : 'var(--text)',
                        border: '1px solid var(--accent)',
                        borderRadius: '8px', padding: '6px 16px', cursor: 'pointer'
                    }}
                >
                    Explain
                </button>
                <button
                    onClick={() => setMode('quiz')}
                    style={{
                        background: mode === 'quiz' ? 'var(--accent)' : 'transparent',
                        color: mode === 'quiz' ? 'white' : 'var(--text)',
                        border: '1px solid var(--accent)',
                        borderRadius: '8px', padding: '6px 16px', cursor: 'pointer'
                    }}
                >
                    Quiz Me
                </button>
            </div>

            <div
                style={{
                    flex: 1,
                    flexDirection: "column",
                    overflowY: 'auto',
                    backgroundColor: "var(--code-bg)",
                    borderRadius: '15px',
                    padding: '10px',
                    display: 'flex',
                    gap: '15px'
                }}
            >
                {messages.map((e, i) => (
                    <div key={i} className={e.role === 'user' ? 'usermessage' : 'aimessage'}>
                        <p>{e.content}</p>
                    </div>
                ))}
                {isDisabled && (
                    <div className="aimessage">
                        <p style={{ color: 'var(--text)' }}>Thinking...</p>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div style={{ padding: 10, paddingBottom: '0px', width: '100%', boxSizing: "border-box", overflow: 'hidden' }}>
                <form
                    style={{ display: "flex", flexDirection: 'row', gap: '10px', paddingBottom: '5px' }}
                    onSubmit={(e) => {
                        e.preventDefault()
                        sendMessage()
                    }}
                >
                    <textarea
                        style={{ width: '100%' }}
                        rows={1}
                        ref={ref}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                e.target.form.requestSubmit()
                            }
                        }}
                        disabled={isDisabled}
                    />
                    <label style={{
                        cursor: 'pointer',
                        color: 'var(--text)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        padding: '0 12px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '20px'
                    }}>
                        {uploadedFile ? '📄' : '📎'}
                        <input
                            type="file"
                            accept=".txt"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files[0]) uploadFile(e.target.files[0])
                            }}
                        />
                    </label>
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