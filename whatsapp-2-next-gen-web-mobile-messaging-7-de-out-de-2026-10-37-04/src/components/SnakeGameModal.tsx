import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, RotateCcw, Volume2, VolumeX, Trophy, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface SnakeGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const BASE_SPEED = 110; // ms per tick

export const SnakeGameModal: React.FC<SnakeGameModalProps> = ({
  isOpen,
  onClose,
  accentColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [specialFood, setSpecialFood] = useState<Point | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('wa2_snake_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [newRecordAlert, setNewRecordAlert] = useState(false);

  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const collision = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!collision) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    const initialFood = generateFood(INITIAL_SNAKE);
    setFood(initialFood);
    setSpecialFood(null);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    setNewRecordAlert(false);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when playing
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        if (!isGameOver && isPlaying) {
          setIsPaused(prev => !prev);
        }
        return;
      }

      if (isGameOver) {
        if (e.key === 'Enter') {
          resetGame();
        }
        return;
      }

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isGameOver, isPlaying]);

  // Main game loop
  useEffect(() => {
    if (!isOpen || !isPlaying || isPaused || isGameOver) return;

    const speed = Math.max(60, BASE_SPEED - Math.floor(score / 5) * 5);

    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };

        switch (directionRef.current) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        // Check Wall Collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          handleGameOver();
          return prevSnake;
        }

        // Check Self Collision
        for (let i = 0; i < prevSnake.length; i++) {
          if (prevSnake[i].x === head.x && prevSnake[i].y === head.y) {
            handleGameOver();
            return prevSnake;
          }
        }

        const newSnake = [head, ...prevSnake];

        // Check Eating normal food
        if (head.x === food.x && head.y === food.y) {
          const pointsEarned = 10;
          const nextScore = score + pointsEarned;
          setScore(nextScore);
          sounds.setEnabled(soundOn);
          sounds.playSnakeEat();

          if (nextScore > highScore) {
            setHighScore(nextScore);
            localStorage.setItem('wa2_snake_highscore', nextScore.toString());
            if (!newRecordAlert) {
              setNewRecordAlert(true);
              try {
                confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
              } catch {
                // ignore
              }
            }
          }

          setFood(generateFood(newSnake));

          // Random chance for special WhatsApp gold orb
          if (Math.random() < 0.25 && !specialFood) {
            setSpecialFood(generateFood(newSnake));
          }
        } else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
          // Special Bonus Food!
          const nextScore = score + 30;
          setScore(nextScore);
          sounds.playSnakeEat();
          setSpecialFood(null);

          if (nextScore > highScore) {
            setHighScore(nextScore);
            localStorage.setItem('wa2_snake_highscore', nextScore.toString());
          }
        } else {
          // Normal move: remove tail
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, isPaused, isGameOver, food, specialFood, score, highScore, soundOn, generateFood, newRecordAlert]);

  const handleGameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);
    sounds.playSnakeDie();
  };

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw normal food (WhatsApp emerald glow)
    const fx = food.x * cellSize;
    const fy = food.y * cellSize;
    ctx.fillStyle = accentColor || '#00a884';
    ctx.shadowColor = accentColor || '#00a884';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(fx + cellSize / 2, fy + cellSize / 2, cellSize / 2.3, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright center for food
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx + cellSize / 2, fy + cellSize / 2, cellSize / 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw special food if active (Golden Star)
    if (specialFood) {
      const sfx = specialFood.x * cellSize;
      const sfy = specialFood.y * cellSize;
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(sfx + cellSize / 2, sfy + cellSize / 2, cellSize / 2.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.font = `${Math.floor(cellSize * 0.7)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', sfx + cellSize / 2, sfy + cellSize / 2);
    }

    // Draw Snake
    snake.forEach((seg, index) => {
      const sx = seg.x * cellSize;
      const sy = seg.y * cellSize;
      const isHead = index === 0;

      if (isHead) {
        ctx.fillStyle = '#34d399';
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 8;
      } else {
        // Gradient fade along tail
        const alpha = Math.max(0.4, 1 - (index / snake.length) * 0.6);
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      // Rounded snake segments
      const pad = 1.5;
      ctx.roundRect(sx + pad, sy + pad, cellSize - pad * 2, cellSize - pad * 2, isHead ? 6 : 4);
      ctx.fill();

      // Draw eyes on head
      if (isHead) {
        ctx.fillStyle = '#000000';
        const eyeOffset = cellSize / 3.5;
        const eyeSize = cellSize / 6;

        let leftEye = { x: sx + eyeOffset, y: sy + eyeOffset };
        let rightEye = { x: sx + cellSize - eyeOffset, y: sy + eyeOffset };

        if (directionRef.current === 'DOWN') {
          leftEye = { x: sx + eyeOffset, y: sy + cellSize - eyeOffset };
          rightEye = { x: sx + cellSize - eyeOffset, y: sy + cellSize - eyeOffset };
        } else if (directionRef.current === 'LEFT') {
          leftEye = { x: sx + eyeOffset, y: sy + eyeOffset };
          rightEye = { x: sx + eyeOffset, y: sy + cellSize - eyeOffset };
        } else if (directionRef.current === 'RIGHT') {
          leftEye = { x: sx + cellSize - eyeOffset, y: sy + eyeOffset };
          rightEye = { x: sx + cellSize - eyeOffset, y: sy + cellSize - eyeOffset };
        }

        ctx.beginPath();
        ctx.arc(leftEye.x, leftEye.y, eyeSize, 0, Math.PI * 2);
        ctx.arc(rightEye.x, rightEye.y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food, specialFood, accentColor]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 text-white shadow-2xl p-5 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐍</span>
            <div>
              <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                <span>WhatsApp 2 • Cobrinha Secreta</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">
                  RETRO
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Easter egg clássico desbloqueado!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title={soundOn ? 'Desativar som' : 'Ativar som'}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-600" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-2 gap-3 my-3">
          <div className="bg-zinc-950 rounded-xl p-2.5 border border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pontuação</span>
            </div>
            <span className="font-mono font-bold text-lg text-emerald-400">
              {score}
            </span>
          </div>

          <div className="bg-zinc-950 rounded-xl p-2.5 border border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Recorde</span>
            </div>
            <span className="font-mono font-bold text-lg text-amber-400">
              {highScore}
            </span>
          </div>
        </div>

        {/* Game Canvas Container */}
        <div className="relative mx-auto rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-square w-full max-w-[340px] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="w-full h-full block"
          />

          {/* Start Screen Overlay */}
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
              <span className="text-4xl mb-2 animate-bounce">🍎</span>
              <h4 className="text-base font-bold text-white mb-1">
                Jogo da Cobrinha WhatsApp 2
              </h4>
              <p className="text-xs text-zinc-400 mb-4 max-w-[240px]">
                Coma os ícones e maçãs verdes para crescer. Use as setas ou o controle touch abaixo.
              </p>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-black shadow-lg transition active:scale-95"
                style={{ backgroundColor: accentColor || '#10b981' }}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Começar Jogo</span>
              </button>
            </div>
          )}

          {/* Game Over Screen Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 animate-in fade-in">
              <span className="text-3xl mb-1">💥</span>
              <h4 className="text-lg font-bold text-rose-500 mb-0.5">
                Fim de Jogo!
              </h4>
              <p className="text-xs text-zinc-300 mb-2">
                Você fez <strong className="text-emerald-400">{score} pontos</strong>
              </p>
              {newRecordAlert && (
                <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold mb-3 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Novo Recorde Pessoal!</span>
                </div>
              )}
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-black shadow-lg transition active:scale-95"
                style={{ backgroundColor: accentColor || '#10b981' }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Jogar Novamente</span>
              </button>
            </div>
          )}

          {/* Paused Screen */}
          {isPaused && !isGameOver && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center">
              <p className="text-sm font-bold text-white mb-2">Jogo Pausado</p>
              <button
                onClick={() => setIsPaused(false)}
                className="px-4 py-1.5 rounded-lg text-xs bg-emerald-500 text-black font-semibold"
              >
                Continuar
              </button>
            </div>
          )}
        </div>

        {/* Mobile Touch D-Pad */}
        <div className="mt-4 flex flex-col items-center justify-center">
          <div className="grid grid-cols-3 gap-1.5 w-44">
            <div />
            <button
              onClick={() => {
                if (directionRef.current !== 'DOWN') setDirection('UP');
              }}
              className="h-10 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-xl flex items-center justify-center text-zinc-300 transition"
              title="Cima"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div />

            <button
              onClick={() => {
                if (directionRef.current !== 'RIGHT') setDirection('LEFT');
              }}
              className="h-10 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-xl flex items-center justify-center text-zinc-300 transition"
              title="Esquerda"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (!isGameOver && isPlaying) setIsPaused(!isPaused);
              }}
              className="h-10 bg-zinc-850 border border-zinc-700 hover:bg-zinc-800 rounded-xl flex items-center justify-center text-xs font-mono text-zinc-400"
              title="Pausar"
            >
              {isPaused ? '▶' : '⏸'}
            </button>
            <button
              onClick={() => {
                if (directionRef.current !== 'LEFT') setDirection('RIGHT');
              }}
              className="h-10 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-xl flex items-center justify-center text-zinc-300 transition"
              title="Direita"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <div />
            <button
              onClick={() => {
                if (directionRef.current !== 'UP') setDirection('DOWN');
              }}
              className="h-10 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-xl flex items-center justify-center text-zinc-300 transition"
              title="Baixo"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <div />
          </div>

          <p className="mt-2 text-[10px] text-zinc-500">
            Controles: Use as teclas W, A, S, D ou as setas do teclado. Barra de espaço para pausar.
          </p>
        </div>
      </div>
    </div>
  );
};
