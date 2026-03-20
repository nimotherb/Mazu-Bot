const { useState, useEffect, useRef, useCallback } = React;

// --- Linear Incense Smoke (Full Screen) ---
const SmokeCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        class IncenseLine {
            constructor() {
                this.x = Math.random() * w;
                this.y = h + Math.random() * 200; 
                this.length = Math.random() * 150 + 50;
                this.speedY = Math.random() * -0.8 - 0.2;
                this.sway = Math.random() * 2;
                this.swaySpeed = Math.random() * 0.02;
                this.life = Math.random() * 0.03 + 0.01;
                this.opacity = Math.random() * 0.15 + 0.05;
            }
            update() {
                this.y += this.speedY;
                this.x += Math.sin(this.y * this.swaySpeed) * this.sway;
                
                if (this.y < -this.length) {
                    this.y = h + 100;
                    this.x = Math.random() * w;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                // Draw a gentle bezier curve upwards
                ctx.bezierCurveTo(
                    this.x + Math.sin(this.y*0.01)*20, this.y - this.length/2, 
                    this.x - Math.sin(this.y*0.01)*20, this.y - this.length, 
                    this.x, this.y - this.length
                );
                
                const gradient = ctx.createLinearGradient(0, this.y, 0, this.y - this.length);
                gradient.addColorStop(0, `rgba(200, 200, 200, 0)`);
                gradient.addColorStop(0.5, `rgba(220, 220, 220, ${this.opacity})`);
                gradient.addColorStop(1, `rgba(200, 200, 200, 0)`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = Math.random() * 3 + 1;
                ctx.stroke();
            }
        }

        for (let i = 0; i < 40; i++) particles.push(new IncenseLine());

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas id="smoke-canvas" ref={canvasRef} />;
};

// --- Intro Screen ---
const IntroCinematic = ({ onFinish }) => {
    return (
        <div className="intro-screen" onClick={onFinish}>
            <div className="intro-text">
                「在生滅流轉的宇宙中，我是『默』。」<br/><br/>
                你的名字與降生時辰，織就了這具靈魂的四象軌跡。<br/><br/>
                這不是尋常的問答，而是靈體波長的對齊。<br/><br/>
                請隨我，一起探入你的本命星辰。
            </div>
        </div>
    );
};

// --- Form with MBTI ---
const EntryForm = ({ onSubmit, formData, onFormChange }) => {
    return (
        <div className="glass-container disperse-down">
            <div className="form-title highlight">
                靈波<br/>對齊
            </div>
            <form className="almanac-form" onSubmit={onSubmit}>
                <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                    <div className="input-group" style={{flex: '1 1 45%'}}>
                        <label>塵世名號 (信士/信女)</label>
                        <input type="text" name="name" value={formData.name} onChange={onFormChange} required placeholder="請輸入本名" />
                    </div>
                    <div className="input-group" style={{flex: '1 1 45%'}}>
                        <label>性別</label>
                        <select name="gender" value={formData.gender} onChange={onFormChange}>
                            <option value="男">乾 (男)</option>
                            <option value="女">坤 (女)</option>
                            <option value="其他">其他</option>
                        </select>
                    </div>
                    <div className="input-group" style={{flex: '1 1 45%'}}>
                        <label>降生之日 (西元)</label>
                        <input type="date" name="birth_date" value={formData.birth_date} onChange={onFormChange} required />
                    </div>
                    <div className="input-group" style={{flex: '1 1 45%'}}>
                        <label>降生地點</label>
                        <input type="text" name="location" value={formData.location} onChange={onFormChange} required placeholder="例如：台北市" />
                    </div>
                    <div className="input-group" style={{flex: '1 1 100%'}}>
                        <label>你的靈魂頻率 (MBTI)</label>
                        <select name="mbti" value={formData.mbti} onChange={onFormChange}>
                            <option value="不知道">不知道 / 請為我探測</option>
                            <option value="INTJ">INTJ (建築師)</option>
                            <option value="INTP">INTP (邏輯學家)</option>
                            <option value="ENTJ">ENTJ (指揮官)</option>
                            <option value="ENTP">ENTP (辯論家)</option>
                            <option value="INFJ">INFJ (提倡者)</option>
                            <option value="INFP">INFP (調停者)</option>
                            <option value="ENFJ">ENFJ (主人公)</option>
                            <option value="ENFP">ENFP (競選者)</option>
                            <option value="ISTJ">ISTJ (物流師)</option>
                            <option value="ISFJ">ISFJ (守衛者)</option>
                            <option value="ESTJ">ESTJ (總經理)</option>
                            <option value="ESFJ">ESFJ (執政官)</option>
                            <option value="ISTP">ISTP (鑑賞家)</option>
                            <option value="ISFP">ISFP (探險家)</option>
                            <option value="ESTP">ESTP (企業家)</option>
                            <option value="ESFP">ESFP (表演者)</option>
                        </select>
                    </div>
                </div>
                <div style={{textAlign: 'center', marginTop: '20px'}}>
                    <button type="submit" className="seal-btn">開啟連結</button>
                </div>
            </form>
        </div>
    );
};

// --- Fast 4-Question MBTI ---
const fastMbtiBank = {
    E_I: [
        { text: "在熙來攘往的群體中，你的靈魂感到...", optA: "能量共振，充滿活力", optB: "消耗甚速，渴望獨處", valA: 'E', valB: 'I' },
    ],
    S_N: [
        { text: "看待這個宇宙運行的規律時，你更關注...", optA: "眼前具體的細節與當下", optB: "隱藏在背後的深層意義", valA: 'S', valB: 'N' },
    ],
    T_F: [
        { text: "面對抉擇的十字路口，指引你的是...", optA: "冷靜的客觀邏輯與真理", optB: "慈悲的同理心與情感和諧", valA: 'T', valB: 'F' },
    ],
    J_P: [
        { text: "行走於生命的旅程，你偏好...", optA: "按圖索驥，步步為營", optB: "隨遇而安，擁抱未知", valA: 'J', valB: 'P' },
    ]
};

const MBTIQuiz = ({ onFinish }) => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scores, setScores] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });

    useEffect(() => {
        let selected = [];
        ['E_I', 'S_N', 'T_F', 'J_P'].forEach(cat => {
            const arr = fastMbtiBank[cat];
            selected.push(arr[Math.floor(Math.random() * arr.length)]);
        });
        setQuestions(selected); 
    }, []);

    const handleAnswer = (val) => {
        const newScores = { ...scores, [val]: scores[val] + 1 };
        setScores(newScores);
        if (currentIndex < 3) {
            setCurrentIndex(currentIndex + 1);
        } else {
            const char1 = newScores.E >= newScores.I ? 'E' : 'I';
            const char2 = newScores.S >= newScores.N ? 'S' : 'N';
            const char3 = newScores.T >= newScores.F ? 'T' : 'F';
            const char4 = newScores.J >= newScores.P ? 'J' : 'P';
            onFinish(`${char1}${char2}${char3}${char4}`);
        }
    };

    if (questions.length === 0) return null;
    const q = questions[currentIndex];

    return (
        <div className="glass-container disperse-down" style={{justifyContent: 'center'}}>
            <div className="almanac-form" style={{alignItems: 'center', justifyContent: 'center'}}>
                <div style={{color: 'var(--vermilion-dark)', marginBottom: '30px', letterSpacing: '4px', fontSize: '20px'}}>
                    靈魂波長探測 ({currentIndex + 1}/4)
                </div>
                <div className="quiz-question" style={{fontSize: '22px', marginBottom: '40px', textAlign: 'center'}}>{q.text}</div>
                <div className="quiz-options">
                    <button className="quiz-btn" onClick={() => handleAnswer(q.valA)}>{q.optA}</button>
                    <button className="quiz-btn" onClick={() => handleAnswer(q.valB)}>{q.optB}</button>
                </div>
            </div>
        </div>
    );
};

// --- History Sidebar ---
const HistorySidebar = ({ history, onSelect }) => {
    if(history.length === 0) return null;
    return (
        <div className="history-sidebar disperse-left">
            {history.map((slip, i) => (
                <div key={i} className="history-item" onClick={() => onSelect(slip)}>
                    {slip.name} ({slip.category})
                </div>
            ))}
        </div>
    );
};

// --- Main App Logic ---
const App = () => {
    const [flowState, setFlowState] = useState('intro'); // intro -> form -> quiz -> chat
    const [isIdle, setIsIdle] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '', gender: '男', birth_date: '', location: '', mbti: '不知道'
    });
    
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Divination State
    const [lotteryDb, setLotteryDb] = useState([]);
    const [drawnHistory, setDrawnHistory] = useState([]); 
    const [viewingHistorySlip, setViewingHistorySlip] = useState(null);
    const [activeCategories, setActiveCategories] = useState({
        "感情": true, "事業": true, "健康": true, "財運": true, "流年": true
    });
    
    // Ritual specific states
    const [ritualPhase, setRitualPhase] = useState('none'); 
    const [ritualText, setRitualText] = useState('');

    // Bwa Bwei Anim states
    const [bgBweiAnim, setBgBweiAnim] = useState('idle');
    const [bweiFaceClass, setBweiFaceClass] = useState({'left': '', 'right': ''});

    // Fetch DB Absolute/Relative Logic
    useEffect(() => {
        const fetchDb = async () => {
            try {
                const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const apiUrl = (isLocal && window.location.port !== '8000') ? 'http://127.0.0.1:8000/api/lottery' : '/api/lottery';
                const res = await fetch(apiUrl);
                const data = await res.json();
                setLotteryDb(data);
            } catch (e) {
                console.log("Lottery DB fetch failed");
            }
        };
        fetchDb();
    }, []);

    // Disperse Detection
    useEffect(() => {
        let idleTimer;
        let lastScrollY = window.scrollY;

        const handleInteraction = () => {
            setIsIdle(false);
            clearTimeout(idleTimer);
            if(flowState === 'chat' && !isLoading && !viewingHistorySlip) {
                idleTimer = setTimeout(() => setIsIdle(true), 15000); 
            }
        };

        const handleScroll = () => {
            handleInteraction();
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
                if (window.scrollY > lastScrollY) {
                    setIsIdle(true); 
                }
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener('mousemove', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('touchmove', handleScroll, { passive: true });

        handleInteraction();
        return () => {
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('touchmove', handleScroll);
            clearTimeout(idleTimer);
        }
    }, [flowState, isLoading, viewingHistorySlip]);

    useEffect(() => {
        if(flowState === 'intro') {
            const timer = setTimeout(() => setFlowState('form'), 4500);
            return () => clearTimeout(timer);
        }
    }, [flowState]);

    useEffect(() => {
        if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const startChat = (finalMbti) => {
        setFormData(prev => ({ ...prev, mbti: finalMbti }));
        setMessages([{ sender: 'mazu', text: `(無聲的線香裊裊上升) 孩子，歡迎你。默已測得了你的天地四象與靈波。茫茫宇宙中，有什麼緣分或牽絆讓你感到迷惘？隨時都可以告訴默。` }]);
        setFlowState('chat');
    };

    const sendMessage = async (customMsg = null, isHidden = false, slipContext = null) => {
        const msgToSend = customMsg || input.trim();
        if (!msgToSend && !customMsg) return;
        
        if(!isHidden) {
            setMessages(prev => [...prev, { sender: 'user', text: msgToSend }]);
        }
        if(!customMsg) setInput('');
        setIsLoading(true);
        setIsIdle(false);

        try {
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const apiUrl = (isLocal && window.location.port !== '8000') ? 'http://127.0.0.1:8000/api/chat' : '/api/chat';

            const payloadParams = { message: msgToSend, user_data: formData };
            
            // Pass the fortune directly if provided, or use the currently viewing one
            const contextToPass = slipContext || viewingHistorySlip;
            if (isHidden && contextToPass) {
                payloadParams.fortune_context = JSON.stringify(contextToPass); 
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadParams)
            });
            if (!response.ok) throw new Error('API Request Failed');
            const data = await response.json();
            setMessages(prev => [...prev, { sender: 'mazu', text: data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'mazu', text: '（星辰干擾，靈波中斷，請稍後再試。）' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Strict Bwa Bwei Mechanics ---
    const triggerRitualMenu = () => {
        if(viewingHistorySlip) {
            setViewingHistorySlip(null);
        }
        if(Object.values(activeCategories).every(v => !v)) {
            alert("五大天機皆已洩漏，今日緣分已盡。"); return;
        }
        setRitualPhase('ask-type');
        setRitualText("請選擇您當前欲祈問的因緣維度：");
    };

    // Fix asynchronous bugs by explicitly passing arguments through the sequence!
    const processThrowSequence = (category, throwNum, existingSlip) => {
        setBgBweiAnim('animating');
        setBweiFaceClass({left:'', right:''}); 
        
        if (throwNum === 1) setRitualText(`正在為【${category}】請示神意... (擲筊中)`);
        else setRitualText(`已經抽出第 ${existingSlip ? existingSlip.id : ''} 籤，再次擲筊確認神意...`);

        setTimeout(() => {
            const r = Math.random();
            let resultStatus = '';
            if (r < 0.35) resultStatus = 'sheng';
            else if (r < 0.70) resultStatus = 'xiao';
            else resultStatus = 'gai';

            if(resultStatus === 'sheng') setBweiFaceClass({left:'flat-face', right:'round-face'});
            else if(resultStatus === 'xiao') setBweiFaceClass({left:'flat-face', right:'flat-face'});
            else setBweiFaceClass({left:'round-face', right:'round-face'});

            setBgBweiAnim('idle');

            if (throwNum === 1) {
                if (resultStatus === 'sheng') {
                    const fallbackSlip = {id: 1, name:'第 1 籤', poem:'日出便見風雲散...。', meaning:'默認籤詩', auspicious:'大吉', suitable:['靜心'], taboo:['動怒']};
                    const slip = (lotteryDb && lotteryDb.length > 0) ? lotteryDb[Math.floor(Math.random() * lotteryDb.length)] : fallbackSlip;
                    
                    setRitualPhase('tossing-2');
                    setRitualText(`神明允准！為您的【${category}】搖出籤筒中的 ${slip.name}。立即進行最終確認...`);
                    setTimeout(() => processThrowSequence(category, 2, slip), 2500);
                } else if (resultStatus === 'xiao') {
                    setRitualText("笑杯。神靈微笑不語，緣分尚未聚足。請重新請示。");
                    setRitualPhase('ask-type');
                } else {
                    setRitualText("蓋杯。阻礙重重，方向有誤，請靜心後重新請示。");
                    setRitualPhase('ask-type');
                }
            } else if (throwNum === 2) {
                if (resultStatus === 'sheng') {
                    setRitualText(`連續聖杯！千真萬確為 ${existingSlip.name}。正在開啟靈意...`);
                    setTimeout(() => {
                        setActiveCategories(prev => ({...prev, [category]: false}));
                        const finalSlipObj = {...existingSlip, category: category};
                        setDrawnHistory(prev => [...prev, finalSlipObj]);
                        setRitualPhase('none');
                        setViewingHistorySlip(finalSlipObj);
                        
                        // Silent inject message
                        setMessages(prev => [...prev, { 
                            sender: 'user', 
                            text: `(求得 ${finalSlipObj.name})`,
                            isSystem: true 
                        }]);
                        sendMessage(`請以神明化身『默』的角度，針對這支籤詩賦予我指引。`, true, finalSlipObj);
                    }, 2000);
                } else {
                    setRitualPhase('tossing-2-failed');
                    setRitualText(`${resultStatus==='xiao'?'笑杯':'蓋杯'}。神明表示此籤不妥。系統即將為您重新亂數生成新籤詩。`);
                    setTimeout(() => {
                         const fallbackSlip = {id: 1, name:'第 1 籤', poem:'測試', meaning:'測試', auspicious:'大吉', suitable:['靜心'], taboo:['動怒']};
                         const newSlip = (lotteryDb && lotteryDb.length > 0) ? lotteryDb[Math.floor(Math.random() * lotteryDb.length)] : fallbackSlip;
                         processThrowSequence(category, 2, newSlip);
                    }, 3000);
                }
            }
        }, 2000); 
    };

    const isThreeColumnActive = viewingHistorySlip !== null;

    return (
        <div className={`app-container ${isIdle ? 'idle' : ''} ${isThreeColumnActive ? 'three-column-layout' : ''}`}>
            
            <SmokeCanvas />
            
            {/* Background or Right-Column Bwa Bwei */}
            {(flowState === 'chat' || ritualPhase !== 'none') && (
                <div className={`bg-bwei-container disperse-right ${ritualPhase !== 'none' ? 'ritual-active' : ''}`}>
                    <div className={`bg-bwei left-bwei ${bgBweiAnim === 'animating' ? 'throw-anim' : ''} ${bweiFaceClass.left}`}></div>
                    <div className={`bg-bwei right-bwei ${bgBweiAnim === 'animating' ? 'throw-anim' : ''} ${bweiFaceClass.right}`}></div>
                </div>
            )}

            {flowState === 'intro' && <IntroCinematic onFinish={() => setFlowState('form')} />}
            
            {flowState === 'form' && (
                <EntryForm 
                    onSubmit={(e) => { e.preventDefault(); setFlowState(formData.mbti === '不知道' ? 'quiz' : 'chat'); if(formData.mbti !== '不知道') startChat(formData.mbti); }} 
                    formData={formData} 
                    onFormChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} 
                />
            )}
            
            {flowState === 'quiz' && <MBTIQuiz onFinish={startChat} />}
            
            {flowState === 'chat' && (
                <>
                    <HistorySidebar history={drawnHistory} onSelect={(slip) => setViewingHistorySlip(slip)} />
                    
                    {/* Left Column (When viewing slip) */}
                    {isThreeColumnActive && (
                        <div className="fortune-slip-panel disperse-left">
                            <div className="fortune-header">{viewingHistorySlip.name} <span>({viewingHistorySlip.category})</span></div>
                            <div className="fortune-stars">{viewingHistorySlip.auspicious}</div>
                            
                            <div className="fortune-body">
                                <div className="fortune-poem">
                                    {(viewingHistorySlip.poem || "無詩句。").split('。')[0]}<br/>
                                    {(viewingHistorySlip.poem || "。").split('。')[1]}
                                </div>
                                <div className="fortune-meta">
                                    <div>【宜】 {viewingHistorySlip.suitable ? viewingHistorySlip.suitable.join('、') : ''}</div>
                                    <div style={{marginTop: '10px'}}>【忌】 {viewingHistorySlip.taboo ? viewingHistorySlip.taboo.join('、') : ''}</div>
                                    <div style={{marginTop: '10px', color: '#111'}}>引路色：{viewingHistorySlip.lucky_color}</div>
                                    <div>吉位：{viewingHistorySlip.lucky_direction}</div>
                                </div>
                            </div>
                            <button className="close-slip-btn" onClick={() => setViewingHistorySlip(null)}>
                                關閉籤紙
                            </button>
                        </div>
                    )}
                    
                    {/* Center Column / Chat */}
                    <div className="glass-container disperse-down">
                        <div className="form-title highlight" style={{fontSize: '24px'}}>默</div>
                        <div className="almanac-form" style={{padding: '20px', overflow: 'hidden'}}>
                            
                            <div className="messages" onScroll={() => setIsIdle(false)}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} style={{display: 'flex', flexDirection: 'column'}}>
                                        <div className={`message ${msg.sender}`} style={{opacity: msg.isSystem ? 0.5:1}}>{msg.text}</div>
                                        {msg.sender === 'mazu' && viewingHistorySlip !== null && idx === messages.length - 1 && (
                                            <div className="quick-reply-dock" style={{alignSelf: 'flex-start', marginLeft: '10px'}}>
                                                <button className="quick-btn" onClick={() => sendMessage(`請告訴我「${viewingHistorySlip.name}」這支籤詩故事由來。`, false, viewingHistorySlip)}>故事由來</button>
                                                <button className="quick-btn" onClick={() => sendMessage(`請為我詳細解說這支籤的深層哲理。`, false, viewingHistorySlip)}>詳細解說</button>
                                                <button className="quick-btn" onClick={() => sendMessage(`這支籤對應我目前的問題有何具體建議？`, false, viewingHistorySlip)}>對應現狀建議</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && <div className="message mazu" style={{opacity: 0.7}}>解讀真意中...</div>}
                                <div ref={messagesEndRef} />
                            </div>

                            <div style={{display: 'flex', paddingTop: '15px', marginTop: '10px', borderTop: '1px dashed #555', gap: '10px'}}>
                                <button className="seal-btn" style={{margin: '0', padding: '10px 15px', fontSize: '14px', animation: Object.values(activeCategories).some(Boolean) ? 'breathe 3s infinite alternate' : 'none'}} onClick={triggerRitualMenu}>求籤</button>
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => { if(e.key === 'Enter') sendMessage(); }}
                                    placeholder="將你想祈願的事，告訴默..."
                                    disabled={isLoading}
                                    style={{flex: 1, zIndex: 5}}
                                />
                                <button onClick={() => sendMessage()} disabled={isLoading} className="seal-btn" style={{margin: '0', padding: '10px 20px', fontSize: '16px'}}>傾訴</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Ritual Selection Screen */}
            {ritualPhase === 'ask-type' && (
                <div className="ritual-overlay" style={{background: 'rgba(0,0,0,0.85)', position: 'absolute', top:0, left:0, width:'100vw', height:'100vh', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{color: '#fff', fontSize: '24px', letterSpacing: '5px', marginBottom: '30px'}}>{ritualText}</div>
                    <div className="fortune-categories">
                        {Object.keys(activeCategories).map(cat => (
                            <button key={cat} className={`cat-btn ${cat} ${!activeCategories[cat] ? 'disabled':''}`} onClick={() => {setRitualPhase('tossing-1'); processThrowSequence(cat, 1, null);}}>{cat}</button>
                        ))}
                    </div>
                    <button className="quick-btn" style={{marginTop: '40px'}} onClick={() => setRitualPhase('none')}>取消</button>
                </div>
            )}

            {/* Throwing Text Overlay */}
            {(ritualPhase === 'tossing-1' || ritualPhase === 'tossing-2' || ritualPhase === 'tossing-2-failed') && (
                <div className="ritual-overlay" style={{background: 'rgba(0,0,0,0.4)', position: 'absolute', top:0, left:0, width:'100vw', height:'100vh', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                     <div style={{color: '#fff', fontSize: '26px', letterSpacing: '5px', marginBottom: '30px', textShadow: '0 0 10px #000'}}>{ritualText}</div>
                </div>
            )}

        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
