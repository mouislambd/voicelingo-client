"use client";
import { useState, useEffect, useRef } from "react";

const WORDS = ['confidence', 'practice', 'grammar', 'fluent', 'journey', 'speak', 'learn', 'growth', 'courage', 'listen'];
const EMOJIS = ['🎉', '✨', '🙌'];

export default function WordScrambleGame() {
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [guess, setGuess] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  const shuffle = (word: string) => {
    let scrambledWord = word.split("");
    do {
      scrambledWord.sort(() => Math.random() - 0.5);
    } while (scrambledWord.join("") === word && word.length > 1);
    return scrambledWord;
  };

  const nextWord = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(newWord);
    setScrambled(shuffle(newWord));
    setGuess([]);
    setSuccess(false);
  };

  useEffect(() => {
    nextWord();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleTileClick = (letter: string, index: number) => {
    console.log("Tile clicked:", letter, "at index:", index);
    setGuess([...guess, letter]);
    setScrambled(scrambled.filter((_, i) => i !== index));
  };

  const handleGuessTileClick = (index: number) => {
    const removedLetter = guess[index];
    setGuess(guess.filter((_, i) => i !== index));
    setScrambled([...scrambled, removedLetter]);
  };

  const checkGuess = () => {
    if (guess.join("") === word) {
      setSuccess(true);
      setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
      setScore(score + 1);
      setTimeout(nextWord, 1500);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <section 
      ref={ref} 
      className={`py-20 px-6 max-w-2xl mx-auto transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        @keyframes pop {
          0% { transform: scale(0); }
          80% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-pop { animation: pop 0.4s ease-out; }
      `}</style>
      
      <h2 className="text-3xl font-bold text-[#0B0909] text-center mb-2">Quick Challenge: Unscramble</h2>
      <p className="text-center text-gray-600 mb-2">Test your vocabulary  no sign-up needed</p>
      <p className="text-center text-sm text-[#2E4540] mb-8 font-medium">Tap letters to spell the word. Tap your guess to remove.</p>
      
      <div className={`p-8 bg-white rounded-3xl border-2 transition-colors ${shake ? "animate-shake" : ""} ${success ? "border-green-400" : "border-[#B5B9F0]"}`}>
        
        {success && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 backdrop-blur-sm rounded-3xl animate-pop text-6xl">
                {emoji}
            </div>
        )}

        <div className="flex gap-2 justify-center mb-8 min-h-[60px] flex-wrap">
          {guess.map((letter, i) => (
            <button key={i} onClick={() => handleGuessTileClick(i)} className="w-12 h-12 bg-[#2E4540] text-white rounded-lg font-bold text-xl flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-95 transition-all">
              {letter.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {scrambled.map((letter, i) => (
            <button 
                key={i} 
                onClick={() => handleTileClick(letter, i)} 
                className={`w-12 h-12 bg-[#B5B9F0] text-[#0B0909] rounded-lg font-bold text-xl flex items-center justify-center shadow-md hover:scale-105 hover:shadow-lg hover:border-[#2E4540] border-2 border-transparent transition-all ${i === 0 ? "animate-bounce" : ""}`}
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={checkGuess} className="bg-[#2E4540] text-white px-8 py-2 rounded-full font-bold hover:bg-[#1a2b27] transition">Check</button>
          <button onClick={nextWord} className="bg-gray-200 text-gray-700 px-8 py-2 rounded-full font-bold hover:bg-gray-300 transition">Skip</button>
        </div>
      </div>
      <p className="text-center mt-4 font-bold text-[#2E4540]">Words Solved: {score}</p>
    </section>
  );
}
