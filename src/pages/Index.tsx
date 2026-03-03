import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { books, grades, genres, type Book, type Genre } from '@/data/books';

type View = 'catalog' | 'book' | 'quiz';

const genrePill: Record<Genre, string> = {
  'роман':   'bg-amber-900/40 text-amber-300 border-amber-700/50',
  'повесть': 'bg-stone-700/40 text-stone-300 border-stone-600/50',
  'рассказ': 'bg-blue-900/40 text-blue-300 border-blue-700/50',
  'поэзия':  'bg-rose-900/40 text-rose-300 border-rose-700/50',
  'пьеса':   'bg-purple-900/40 text-purple-300 border-purple-700/50',
  'сказка':  'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  'поэма':   'bg-orange-900/40 text-orange-300 border-orange-700/50',
};

const GOLD = 'hsl(38, 65%, 60%)';
const DARK = 'hsl(220, 18%, 10%)';
const CARD = 'hsl(220, 16%, 13%)';
const BORDER = 'hsl(220, 14%, 20%)';

export default function Index() {
  const [view, setView] = useState<View>('catalog');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filterGrade, setFilterGrade] = useState<number | null>(null);
  const [filterGenre, setFilterGenre] = useState<Genre | null>(null);
  const [search, setSearch] = useState('');

  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizDone, setQuizDone] = useState(false);

  const filtered = useMemo(() => books.filter(b => {
    if (filterGrade && b.grade !== filterGrade) return false;
    if (filterGenre && b.genre !== filterGenre) return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase()) &&
        !b.author.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [filterGrade, filterGenre, search]);

  const openBook = (book: Book) => {
    setSelectedBook(book);
    setView('book');
    window.scrollTo(0, 0);
  };

  const startQuiz = () => {
    setQuizStep(0);
    setAnswers([]);
    setSelected(null);
    setQuizDone(false);
    setView('quiz');
    window.scrollTo(0, 0);
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => {
      const next = [...answers, idx];
      setAnswers(next);
      if (quizStep + 1 >= (selectedBook?.questions.length ?? 0)) {
        setQuizDone(true);
      } else {
        setQuizStep(s => s + 1);
        setSelected(null);
      }
    }, 850);
  };

  const score = answers.filter((a, i) => a === selectedBook?.questions[i].correct).length;

  return (
    <div className="min-h-screen" style={{ background: DARK }}>

      {/* HEADER */}
      <header className="sticky top-0 z-50" style={{ background: 'hsl(220,18%,8%)', borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => { setView('catalog'); setSelectedBook(null); }} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: GOLD }}>
              <Icon name="BookOpen" size={14} className="text-stone-900" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-cormorant text-lg font-bold tracking-wide" style={{ color: GOLD }}>Литерал</span>
              <span className="font-ibm text-[10px] tracking-widest uppercase" style={{ color: 'hsl(38,30%,45%)' }}>Литература 1–11</span>
            </div>
          </button>
          <span className="font-ibm text-xs" style={{ color: 'hsl(220,10%,40%)' }}>{books.length} произведений</span>
        </div>
      </header>

      {/* CATALOG */}
      {view === 'catalog' && (
        <div className="max-w-2xl mx-auto px-4 py-7 animate-fade-in">
          <div className="mb-7">
            <p className="font-ibm text-xs tracking-widest uppercase mb-2" style={{ color: GOLD }}>Школьная программа</p>
            <h1 className="font-cormorant text-5xl font-bold leading-none mb-2" style={{ color: 'hsl(38,25%,90%)' }}>
              Вся литература<br />
              <span style={{ color: GOLD }}>в одном месте</span>
            </h1>
            <p className="font-ibm text-sm leading-relaxed" style={{ color: 'hsl(220,10%,50%)' }}>
              Краткие пересказы · Ключевые темы · Тесты для закрепления
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Icon name="Search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'hsl(220,10%,40%)' }} />
            <input
              type="text"
              placeholder="Название или автор..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 text-sm font-ibm rounded outline-none transition-all"
              style={{ background: CARD, border: `1px solid ${BORDER}`, color: 'hsl(38,25%,85%)' }}
              onFocus={e => e.currentTarget.style.borderColor = GOLD}
              onBlur={e => e.currentTarget.style.borderColor = BORDER}
            />
          </div>

          {/* Grade filter */}
          <div className="mb-4">
            <p className="font-ibm text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: 'hsl(220,10%,40%)' }}>Класс</p>
            <div className="flex flex-wrap gap-1.5">
              {[null, ...grades].map(g => (
                <button
                  key={g ?? 'all'}
                  onClick={() => setFilterGrade(g)}
                  className="px-3 py-1 text-xs font-ibm rounded transition-all"
                  style={{
                    background: filterGrade === g ? GOLD : 'hsl(220,16%,16%)',
                    color: filterGrade === g ? 'hsl(220,18%,10%)' : 'hsl(220,10%,50%)',
                    border: `1px solid ${filterGrade === g ? GOLD : BORDER}`,
                    fontWeight: filterGrade === g ? 600 : 400,
                  }}
                >
                  {g === null ? 'Все' : g}
                </button>
              ))}
            </div>
          </div>

          {/* Genre filter */}
          <div className="mb-6">
            <p className="font-ibm text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: 'hsl(220,10%,40%)' }}>Жанр</p>
            <div className="flex flex-wrap gap-1.5">
              {[null, ...genres].map(g => (
                <button
                  key={g ?? 'all'}
                  onClick={() => setFilterGenre(g as Genre | null)}
                  className="px-3 py-1 text-xs font-ibm rounded capitalize transition-all"
                  style={{
                    background: filterGenre === g ? GOLD : 'hsl(220,16%,16%)',
                    color: filterGenre === g ? 'hsl(220,18%,10%)' : 'hsl(220,10%,50%)',
                    border: `1px solid ${filterGenre === g ? GOLD : BORDER}`,
                    fontWeight: filterGenre === g ? 600 : 400,
                  }}
                >
                  {g === null ? 'Все' : g}
                </button>
              ))}
            </div>
          </div>

          <p className="font-ibm text-xs mb-3" style={{ color: 'hsl(220,10%,38%)' }}>
            Найдено: {filtered.length}
          </p>

          {/* Cards */}
          <div className="space-y-2.5">
            {filtered.length === 0 && (
              <div className="text-center py-16 font-ibm text-sm" style={{ color: 'hsl(220,10%,35%)' }}>
                Ничего не найдено
              </div>
            )}
            {filtered.map((book, i) => (
              <button
                key={book.id}
                onClick={() => openBook(book)}
                className="w-full text-left rounded-lg p-4 card-hover animate-fade-in"
                style={{
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  animationDelay: `${i * 0.04}s`,
                  opacity: 0,
                  animationFillMode: 'forwards',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-ibm px-2 py-0.5 rounded-full border ${genrePill[book.genre]}`}>
                        {book.genre}
                      </span>
                      <span className="text-[10px] font-ibm" style={{ color: 'hsl(220,10%,40%)' }}>
                        {book.grade} кл. · {book.year}
                      </span>
                    </div>
                    <h3 className="font-cormorant text-xl font-semibold leading-tight" style={{ color: 'hsl(38,25%,88%)' }}>
                      {book.title}
                    </h3>
                    <p className="font-ibm text-xs mt-0.5 mb-2" style={{ color: GOLD, opacity: 0.8 }}>
                      {book.author}
                    </p>
                    <p className="font-ibm text-xs leading-relaxed line-clamp-2" style={{ color: 'hsl(220,10%,45%)' }}>
                      {book.summary.slice(0, 110)}…
                    </p>
                  </div>
                  <Icon name="ChevronRight" size={15} style={{ color: BORDER, flexShrink: 0, marginTop: 4 }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BOOK DETAIL */}
      {view === 'book' && selectedBook && (
        <div className="max-w-2xl mx-auto px-4 py-5 animate-fade-in">
          <button
            onClick={() => setView('catalog')}
            className="flex items-center gap-1.5 text-xs font-ibm mb-6 transition-opacity hover:opacity-70"
            style={{ color: 'hsl(220,10%,45%)' }}
          >
            <Icon name="ArrowLeft" size={13} />
            Каталог
          </button>

          <div className="mb-6 pb-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`text-[10px] font-ibm px-2 py-0.5 rounded-full border ${genrePill[selectedBook.genre]}`}>
                {selectedBook.genre}
              </span>
              <span className="text-[10px] font-ibm" style={{ color: 'hsl(220,10%,40%)' }}>
                {selectedBook.grade} класс · {selectedBook.year}
              </span>
            </div>
            <h1 className="font-cormorant text-4xl font-bold leading-tight mb-1" style={{ color: 'hsl(38,25%,90%)' }}>
              {selectedBook.title}
            </h1>
            <p className="font-ibm text-sm font-medium" style={{ color: GOLD }}>{selectedBook.author}</p>
          </div>

          <section className="mb-6">
            <h2 className="font-cormorant text-xl font-semibold mb-3 flex items-center gap-2" style={{ color: 'hsl(38,25%,80%)' }}>
              <Icon name="ScrollText" size={15} style={{ color: GOLD }} />
              Краткое содержание
            </h2>
            <div className="parchment-bg rounded-lg p-4">
              <p className="font-ibm text-sm leading-relaxed" style={{ color: 'hsl(220,10%,68%)' }}>
                {selectedBook.summary}
              </p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="font-cormorant text-xl font-semibold mb-3 flex items-center gap-2" style={{ color: 'hsl(38,25%,80%)' }}>
              <Icon name="Users" size={15} style={{ color: GOLD }} />
              Главные герои
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedBook.characters.map(c => (
                <span
                  key={c}
                  className="font-ibm text-xs px-3 py-1.5 rounded"
                  style={{ background: 'hsl(220,16%,16%)', border: `1px solid ${BORDER}`, color: 'hsl(38,20%,70%)' }}
                >
                  {c}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-7">
            <h2 className="font-cormorant text-xl font-semibold mb-3 flex items-center gap-2" style={{ color: 'hsl(38,25%,80%)' }}>
              <Icon name="Tag" size={15} style={{ color: GOLD }} />
              Ключевые темы
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedBook.themes.map(t => (
                <span
                  key={t}
                  className="font-ibm text-xs px-3 py-1.5 rounded font-medium"
                  style={{ background: 'hsl(38,30%,12%)', border: `1px solid hsl(38,40%,22%)`, color: 'hsl(38,55%,65%)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          <button
            onClick={startQuiz}
            className="w-full py-4 rounded-lg font-ibm font-semibold text-sm tracking-wide transition-all hover:brightness-110 active:scale-[0.99] flex items-center justify-center gap-2"
            style={{ background: GOLD, color: 'hsl(220,18%,10%)' }}
          >
            <Icon name="CheckSquare" size={16} />
            Проверить знания · {selectedBook.questions.length} вопроса
          </button>
        </div>
      )}

      {/* QUIZ */}
      {view === 'quiz' && selectedBook && (
        <div className="max-w-2xl mx-auto px-4 py-5 animate-fade-in">
          <button
            onClick={() => setView('book')}
            className="flex items-center gap-1.5 text-xs font-ibm mb-6 transition-opacity hover:opacity-70"
            style={{ color: 'hsl(220,10%,45%)' }}
          >
            <Icon name="ArrowLeft" size={13} />
            {selectedBook.title}
          </button>

          {!quizDone ? (
            <div className="animate-scale-in">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-ibm text-[10px] uppercase tracking-widest" style={{ color: 'hsl(220,10%,40%)' }}>
                    Вопрос {quizStep + 1} / {selectedBook.questions.length}
                  </p>
                  <p className="font-ibm text-[10px]" style={{ color: GOLD, opacity: 0.7 }}>{selectedBook.title}</p>
                </div>
                <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'hsl(220,14%,20%)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(quizStep / selectedBook.questions.length) * 100}%`, background: GOLD }}
                  />
                </div>
              </div>

              <h2 className="font-cormorant text-2xl font-semibold leading-snug mb-7" style={{ color: 'hsl(38,25%,88%)' }}>
                {selectedBook.questions[quizStep].question}
              </h2>

              <div className="space-y-2.5">
                {selectedBook.questions[quizStep].options.map((opt, i) => {
                  const isCorrect = i === selectedBook.questions[quizStep].correct;
                  const isSelected = selected === i;
                  const revealed = selected !== null;

                  let bg = 'hsl(220,16%,14%)';
                  let border = BORDER;
                  let color = 'hsl(38,15%,70%)';

                  if (revealed) {
                    if (isCorrect)             { bg = 'hsl(145,30%,14%)'; border = 'hsl(145,40%,30%)'; color = 'hsl(145,50%,65%)'; }
                    else if (isSelected)       { bg = 'hsl(350,30%,14%)'; border = 'hsl(350,40%,35%)'; color = 'hsl(350,50%,65%)'; }
                    else                       { color = 'hsl(220,10%,35%)'; }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={revealed}
                      className="w-full text-left px-4 py-3.5 rounded-lg font-ibm text-sm leading-snug transition-all"
                      style={{ background: bg, border: `1px solid ${border}`, color, cursor: revealed ? 'default' : 'pointer' }}
                    >
                      <span className="font-cormorant font-semibold text-base mr-2" style={{ opacity: 0.6 }}>
                        {['А', 'Б', 'В', 'Г'][i]}.
                      </span>
                      {opt}
                      {revealed && isCorrect             && <span className="ml-2 text-emerald-400">✓</span>}
                      {revealed && isSelected && !isCorrect && <span className="ml-2 text-rose-400">✗</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="animate-scale-in text-center py-4">
              <div
                className="inline-flex items-center justify-center w-28 h-28 rounded-full mb-5"
                style={{
                  border: `3px solid ${score === selectedBook.questions.length ? 'hsl(145,40%,35%)' : score >= 2 ? GOLD : 'hsl(350,40%,40%)'}`,
                  background: score === selectedBook.questions.length ? 'hsl(145,30%,12%)' : score >= 2 ? 'hsl(38,30%,12%)' : 'hsl(350,30%,12%)',
                }}
              >
                <span
                  className="font-cormorant text-4xl font-bold"
                  style={{ color: score === selectedBook.questions.length ? 'hsl(145,50%,55%)' : score >= 2 ? GOLD : 'hsl(350,50%,60%)' }}
                >
                  {score}/{selectedBook.questions.length}
                </span>
              </div>

              <h2 className="font-cormorant text-3xl font-bold mb-1" style={{ color: 'hsl(38,25%,88%)' }}>
                {score === selectedBook.questions.length ? 'Отлично!' : score >= 2 ? 'Хорошо' : 'Нужно повторить'}
              </h2>
              <p className="font-ibm text-sm mb-8" style={{ color: 'hsl(220,10%,45%)' }}>
                {score === selectedBook.questions.length
                  ? 'Вы прекрасно знаете это произведение!'
                  : score >= 2
                  ? 'Перечитайте краткое содержание'
                  : 'Вернитесь к пересказу и повторите'}
              </p>

              <div className="text-left space-y-2.5 mb-8">
                {selectedBook.questions.map((q, i) => {
                  const ok = answers[i] === q.correct;
                  return (
                    <div
                      key={i}
                      className="p-3 rounded-lg"
                      style={{
                        background: ok ? 'hsl(145,30%,12%)' : 'hsl(350,30%,12%)',
                        border: `1px solid ${ok ? 'hsl(145,35%,22%)' : 'hsl(350,35%,22%)'}`,
                      }}
                    >
                      <p className="font-ibm text-xs font-medium flex items-center gap-1.5 mb-1"
                        style={{ color: ok ? 'hsl(145,50%,55%)' : 'hsl(350,50%,60%)' }}>
                        {ok ? <Icon name="Check" size={11} /> : <Icon name="X" size={11} />}
                        Вопрос {i + 1}
                      </p>
                      <p className="font-ibm text-xs mb-1" style={{ color: 'hsl(220,10%,55%)' }}>{q.question}</p>
                      {!ok && (
                        <p className="font-ibm text-xs" style={{ color: 'hsl(145,45%,50%)' }}>
                          Правильно: {q.options[q.correct]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={startQuiz}
                  className="w-full py-3.5 rounded-lg font-ibm font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110"
                  style={{ background: GOLD, color: 'hsl(220,18%,10%)' }}
                >
                  <Icon name="RotateCcw" size={14} />
                  Пройти снова
                </button>
                <button
                  onClick={() => setView('book')}
                  className="w-full py-3.5 rounded-lg font-ibm text-sm transition-all hover:brightness-110"
                  style={{ background: 'hsl(220,16%,16%)', border: `1px solid ${BORDER}`, color: 'hsl(38,20%,65%)' }}
                >
                  Вернуться к пересказу
                </button>
                <button
                  onClick={() => { setView('catalog'); setSelectedBook(null); }}
                  className="w-full py-3.5 rounded-lg font-ibm text-sm"
                  style={{ color: 'hsl(220,10%,38%)' }}
                >
                  В каталог
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="h-12" />
    </div>
  );
}
