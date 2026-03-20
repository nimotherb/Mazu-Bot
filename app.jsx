const { useState, useEffect, useRef } = React;

function EntryForm({ onSubmit, formData, onFormChange }) {
  return (
    <div className="glass-container">
      {/* 左側：直書籤詩標題 */}
      <div className="form-title">
        結緣入陣<br/>
        祈點迷津
      </div>
      
      {/* 右側：農民曆風格輸入區 */}
      <form className="almanac-form" onSubmit={onSubmit}>
        <div className="input-group">
          <label>姓名 (信士/信女)</label>
          <input type="text" name="name" value={formData.name} onChange={onFormChange} required placeholder="請輸入本名" />
        </div>
        
        <div className="input-group">
          <label>性別</label>
          <select name="gender" value={formData.gender} onChange={onFormChange} required>
            <option value="男">乾 (男)</option>
            <option value="女">坤 (女)</option>
            <option value="其他">其他</option>
          </select>
        </div>

        <div className="input-group">
          <label>降生之日 (西元年月日)</label>
          <input type="date" name="birth_date" value={formData.birth_date} onChange={onFormChange} required />
        </div>

        <div className="input-group">
          <label>降生之時 (時辰/時間)</label>
          <select name="birth_time" value={formData.birth_time} onChange={onFormChange}>
             {['子時 (23-01)', '丑時 (01-03)', '寅時 (03-05)', '卯時 (05-07)', '辰時 (07-09)', 
               '巳時 (09-11)', '午時 (11-13)', '未時 (13-15)', '申時 (15-17)', '酉時 (17-19)', 
               '戌時 (19-21)', '亥時 (21-23)', '不知道'].map(t => (
               <option key={t} value={t.split(' ')[0]}>{t}</option>
              ))}
          </select>
        </div>

        <div className="input-group">
          <label>降生地點 (縣市)</label>
          <input type="text" name="location" value={formData.location} onChange={onFormChange} required placeholder="例如：台北市" />
        </div>

        <button type="submit" className="seal-btn">誠心祈請</button>
      </form>
    </div>
  );
}

const App = () => {
    const [isChatStarted, setIsChatStarted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        gender: '女',
        birth_date: '',
        birth_time: '子時',
        location: ''
    });

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (isChatStarted) {
            scrollToBottom();
        }
    }, [messages, isChatStarted]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStartChat = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.birth_date || !formData.location) {
            alert("請祈寫完整的結緣資料，以利神明查問。");
            return;
        }
        
        // Unmute and play the background video as soon as user interacts
        const video = document.getElementById('bg-video');
        if (video) {
            video.muted = false; // 解除靜音
            video.play().catch(err => console.log("Video autoplay with sound intercepted by browser:", err));
        }

        setMessages([
            { sender: 'mazu', text: `孩子，默在這裡。今天過得好嗎？有什麼委屈或煩惱，都跟默說說吧。` }
        ]);
        setIsChatStarted(true);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        
        const userMsg = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            // 動態判斷 API 路徑：若在本地開發，則打 localhost:8000；若在雲端 (CodeSandbox/Vercel)，則打相對路徑
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const apiUrl = isLocalhost ? 'http://localhost:8000/api/chat' : '/api/chat';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    user_data: formData
                })
            });

            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            setMessages(prev => [...prev, { sender: 'mazu', text: data.response }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { sender: 'mazu', text: '（系統：連線中斷，請確認網路或伺服器狀態。）' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <React.Fragment>
            {!isChatStarted ? (
                <EntryForm onSubmit={handleStartChat} formData={formData} onFormChange={handleFormChange} />
            ) : (
                <div className="glass-container">
                    <div className="form-title" style={{fontSize: '24px'}}>
                        默<br/>
                        慈聖宮
                    </div>
                    <div className="almanac-form" style={{padding: '20px 30px', display: 'flex', flexDirection: 'column'}}>
                        <div className="messages" style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', paddingRight: '10px'}}>
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`message ${msg.sender}`} style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    background: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(138, 51, 36, 0.15)',
                                    color: 'var(--text-primary)',
                                    borderRight: msg.sender === 'user' ? '3px solid var(--vermilion-dark)' : 'none',
                                    borderLeft: msg.sender === 'mazu' ? '3px solid var(--vermilion-dark)' : 'none',
                                    padding: '12px 18px',
                                    maxWidth: '85%',
                                    lineHeight: '1.6',
                                    letterSpacing: '1px',
                                    boxShadow: msg.sender === 'mazu' ? '2px 2px 10px rgba(0, 0, 0, 0.2)' : 'none'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                            {isLoading && <div className="message mazu" style={{
                                alignSelf: 'flex-start',
                                background: 'rgba(138, 51, 36, 0.15)',
                                borderLeft: '3px solid var(--vermilion-dark)',
                                padding: '12px 18px',
                                opacity: 0.7,
                                color: 'var(--text-primary)',
                                letterSpacing: '1px'
                            }}>祝禱，請示中...</div>}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="input-area" style={{display: 'flex', paddingTop: '15px', marginTop: '10px', borderTop: '1px dashed var(--vermilion-dark)', gap: '10px'}}>
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="傾訴心聲，或祈求「籤詩指引」..."
                                disabled={isLoading}
                                style={{
                                    flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid var(--vermilion-dark)',
                                    color: 'var(--text-primary)', fontFamily: "'Noto Serif TC', serif", fontSize: '16px', padding: '10px 5px', outline: 'none'
                                }}
                            />
                            <button onClick={sendMessage} disabled={isLoading} className="seal-btn" style={{marginTop: '0', padding: '8px 20px', fontSize: '16px'}}>祈願</button>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

const rootNode = document.getElementById('root');
const root = ReactDOM.createRoot(rootNode);
root.render(<App />);
