"use client";
import { useState, useEffect, useRef } from "react";

const WORDS = ['confidence', 'practice', 'grammar', 'fluent', 'journey', 'speak', 'learn', 'growth', 'courage', 'listen'];

export default function WordScrambleGame() {
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [guess, setGuess] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
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
    if (guess.length < word.length) {
      setGuess([...guess, letter]);
      setScrambled(scrambled.filter((_, i) => i !== index));
    }
  };

  const handleGuessTileClick = (letter: string, index: number) => {
    setGuess(guess.filter((_, i) => i !== index));
    setScrambled([...scrambled, letter]);
  };

  const checkGuess = () => {
    if (guess.join("") === word) {
      setSuccess(true);
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
      `}</style>
      <h2 className="text-3xl font-bold text-[#0B0909] text-center mb-2">Quick Challenge: Unscramble</h2>
      <p className="text-center text-gray-600 mb-8">Test your vocabulary — no sign-up needed</p>
      
      <div className={`p-8 bg-white rounded-3xl border border-gray-100 shadow-sm ${shake ? "animate-shake" : ""} ${success ? "border-green-500" : ""}`}>
        <div className="flex gap-2 justify-center mb-8 min-h-[60px] flex-wrap">
          {guess.map((letter, i) => (
            <button key={i} onClick={() => handleGuessTileClick(letter, i)} className="w-12 h-12 bg-[#2E4540] text-white rounded-lg font-bold text-xl flex items-center justify-center shadow-md">
              {letter.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {scrambled.map((letter, i) => (
            <button key={i} onClick={() => handleTileClick(letter, i)} className="w-12 h-12 bg-[#B5B9F0] text-[#0B0909] rounded-lg font-bold text-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform">
              {letter.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={checkGuess} className="bg-[#2E4540] text-white px-8 py-2 rounded-full font-bold">Check</button>
          <button onClick={nextWord} className="bg-gray-200 text-gray-700 px-8 py-2 rounded-full font-bold">Skip</button>
        </div>
      </div>
      <p className="text-center mt-4 font-bold text-[#2E4540]">Words Solved: {score}</p>
    </section>
  );
}
