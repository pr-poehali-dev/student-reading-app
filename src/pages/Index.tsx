import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { books, grades, genres, type Book, type Genre } from '@/data/books';

type View = 'catalog' | 'book' | 'quiz';

const genreColors: Record<Genre, string> = {
  'роман': 'bg-amber-100 text-amber-800 border-amber-300',
  'повесть': 'bg-stone-100 text-stone-700 border-stone-300',
  'рассказ': 'bg-blue-50 text-blue-800 border-blue-300',
  'поэзия': 'bg-rose-50 text-rose-800 border-rose-300',
  'пьеса': 'bg-purple-50 text-purple-800 border-purple-300',
  'сказка': 'bg-emerald-50 text-emerald-800 border-emerald-300',
  'поэма': 'bg-orange-50 text-orange-800 border-orange-300',
};

export default function Index() {
  const [view, setView] = useState<View>('catalog');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filterGrade, setFilterGrade] = useState<number | null>(null);
  const [filterGenre, setFilterGenre] = useState<Genre | null>(null);
  const [search, setSearch] = useState('');

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizDone, setQuizDone] = useState(false);

  const filtered = useMemo(() => {
    return books.filter(b => {
      if (filterGrade && b.grade !== filterGrade) return false;
      if (filterGenre && b.genre !== filterGenre) return false;
      if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.author.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filterGrade, filterGenre, search]);

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
      const newAnswers = [...answers, idx];
      setAnswers(newAnswers);
      if (quizStep + 1 >= (selectedBook?.questions.length ?? 0)) {
        setQuizDone(true);
      } else {
        setQuizStep(quizStep + 1);
        setSelected(null);
      }
    }, 900);
  };

  const score = answers.filter((a, i) => a === selectedBook?.questions[i].correct).length;

  return (
    <div className="min-h-screen" style={{ background: 'hsl(30, 8%, 96%)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-stone-300" style={{ background: 'hsl(350, 40%, 22%)' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => { setView('catalog'); setSelectedBook(null); }}
            className="flex items-center gap-2"
          >
            <span className="font-cormorant text-xl font-bold tracking-wide text-amber-200">Литерал</span>
            <span className="hidden sm:inline text-amber-200/50 text-xs font-ibm tracking-widest uppercase ml-1">Литература 1–11</span>
          </button>
          <div className="flex items-center gap-1 text-amber-200/70 text-xs font-ibm">
            <Icon name="BookOpen" size={14} />
            <span>{books.length} произведений</span>
          </div>
        </div>
      </header>

      {/* CATALOG */}
      {view === 'catalog' && (
        <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
          <div className="mb-6 pt-2">
            <h1 className="font-cormorant text-4xl font-bold leading-tight mb-1" style={{ color: 'hsl(350, 40%, 22%)' }}>
              Школьная программа
            </h1>
            <p className="font-ibm text-sm text-stone-500">Краткие пересказы · Ключевые темы · Проверочные вопросы</p>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Поиск по названию или автору..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm font-ibm border border-stone-300 rounded bg-white focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700/30 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="space-y-3 mb-6">
            <div>
              <p className="text-xs font-ibm font-medium text-stone-400 uppercase tracking-wider mb-2">Класс</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterGrade(null)}
                  className={`px-3 py-1 text-xs font-ibm rounded border transition-all ${filterGrade === null ? 'border-amber-700 text-amber-900 bg-amber-50' : 'border-stone-200 text-stone-500 bg-white hover:border-stone-300'}`}
                >
                  Все
                </button>
                {grades.map(g => (
                  <button
                    key={g}
                    onClick={() => setFilterGrade(filterGrade === g ? null : g)}
                    className={`px-3 py-1 text-xs font-ibm rounded border transition-all ${filterGrade === g ? 'border-amber-700 text-amber-900 bg-amber-50' : 'border-stone-200 text-stone-500 bg-white hover:border-stone-300'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-ibm font-medium text-stone-400 uppercase tracking-wider mb-2">Жанр</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterGenre(null)}
                  className={`px-3 py-1 text-xs font-ibm rounded border transition-all ${filterGenre === null ? 'border-amber-700 text-amber-900 bg-amber-50' : 'border-stone-200 text-stone-500 bg-white hover:border-stone-300'}`}
                >
                  Все
                </button>
                {genres.map(g => (
                  <button
                    key={g}
                    onClick={() => setFilterGenre(filterGenre === g ? null : g)}
                    className={`px-3 py-1 text-xs font-ibm rounded border transition-all capitalize ${filterGenre === g ? 'border-amber-700 text-amber-900 bg-amber-50' : 'border-stone-200 text-stone-500 bg-white hover:border-stone-300'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-2 text-xs font-ibm text-stone-400">
            Найдено: {filtered.length} произведений
          </div>

          {/* Book cards */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-stone-400 font-ibm text-sm">
                Ничего не найдено. Попробуйте изменить фильтры.
              </div>
            )}
            {filtered.map((book, i) => (
              <button
                key={book.id}
                onClick={() => openBook(book)}
                className="w-full text-left bg-white border border-stone-200 rounded p-4 card-hover animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-ibm px-2 py-0.5 rounded-full border ${genreColors[book.genre]}`}>
                        {book.genre}
                      </span>
                      <span className="text-xs font-ibm text-stone-400">{book.grade} класс · {book.year}</span>
                    </div>
                    <h3 className="font-cormorant text-xl font-semibold leading-tight" style={{ color: 'hsl(350, 40%, 22%)' }}>
                      {book.title}
                    </h3>
                    <p className="text-xs font-ibm text-stone-500 mt-0.5">{book.author}</p>
                    <p className="text-xs font-ibm text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                      {book.summary.slice(0, 120)}...
                    </p>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    <Icon name="ChevronRight" size={16} className="text-stone-300" />
                  </div>
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
            className="flex items-center gap-1.5 text-sm font-ibm text-stone-500 hover:text-stone-800 mb-5 transition-colors"
          >
            <Icon name="ArrowLeft" size={15} />
            Каталог
          </button>

          <div className="mb-5 pb-5 border-b border-stone-200">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-ibm px-2 py-0.5 rounded-full border ${genreColors[selectedBook.genre]}`}>
                {selectedBook.genre}
              </span>
              <span className="text-xs font-ibm text-stone-400">{selectedBook.grade} класс · {selectedBook.year}</span>
            </div>
            <h1 className="font-cormorant text-3xl font-bold leading-tight mb-1" style={{ color: 'hsl(350, 40%, 22%)' }}>
              {selectedBook.title}
            </h1>
            <p className="font-ibm text-sm text-stone-500 font-medium">{selectedBook.author}</p>
          </div>

          {/* Summary */}
          <section className="mb-5">
            <h2 className="font-cormorant text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: 'hsl(350, 40%, 22%)' }}>
              <Icon name="FileText" size={16} />
              Краткое содержание
            </h2>
            <div className="parchment-bg rounded p-4 border border-amber-200/60">
              <p className="font-ibm text-sm leading-relaxed text-stone-700">{selectedBook.summary}</p>
            </div>
          </section>

          {/* Characters */}
          <section className="mb-5">
            <h2 className="font-cormorant text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: 'hsl(350, 40%, 22%)' }}>
              <Icon name="Users" size={16} />
              Главные герои
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedBook.characters.map(c => (
                <span key={c} className="font-ibm text-xs px-3 py-1.5 bg-white border border-stone-200 rounded text-stone-700">
                  {c}
                </span>
              ))}
            </div>
          </section>

          {/* Themes */}
          <section className="mb-6">
            <h2 className="font-cormorant text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: 'hsl(350, 40%, 22%)' }}>
              <Icon name="Tag" size={16} />
              Ключевые темы
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedBook.themes.map(t => (
                <span key={t} className="font-ibm text-xs px-3 py-1.5 rounded border font-medium" style={{ background: 'hsl(350, 40%, 96%)', borderColor: 'hsl(350, 40%, 80%)', color: 'hsl(350, 40%, 30%)' }}>
                  {t}
                </span>
              ))}
            </div>
          </section>

          <button
            onClick={startQuiz}
            className="w-full py-4 rounded font-ibm font-semibold text-sm tracking-wide transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2"
            style={{ background: 'hsl(350, 40%, 22%)', color: 'hsl(38, 60%, 88%)' }}
          >
            <Icon name="CheckSquare" size={16} />
            Проверить знания ({selectedBook.questions.length} вопроса)
          </button>
        </div>
      )}

      {/* QUIZ */}
      {view === 'quiz' && selectedBook && (
        <div className="max-w-2xl mx-auto px-4 py-5 animate-fade-in">
          <button
            onClick={() => setView('book')}
            className="flex items-center gap-1.5 text-sm font-ibm text-stone-500 hover:text-stone-800 mb-5 transition-colors"
          >
            <Icon name="ArrowLeft" size={15} />
            {selectedBook.title}
          </button>

          {!quizDone ? (
            <div className="animate-scale-in">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-ibm text-xs text-stone-400 uppercase tracking-wider">Вопрос {quizStep + 1} из {selectedBook.questions.length}</p>
                  <p className="font-ibm text-xs text-stone-400">{selectedBook.title}</p>
                </div>
                <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${((quizStep) / selectedBook.questions.length) * 100}%`, background: 'hsl(350, 40%, 30%)' }}
                  />
                </div>
              </div>

              <h2 className="font-cormorant text-2xl font-semibold leading-snug mb-6" style={{ color: 'hsl(350, 40%, 22%)' }}>
                {selectedBook.questions[quizStep].question}
              </h2>

              <div className="space-y-3">
                {selectedBook.questions[quizStep].options.map((opt, i) => {
                  const isCorrect = i === selectedBook.questions[quizStep].correct;
                  const isSelected = selected === i;
                  const revealed = selected !== null;

                  let cls = 'bg-white border-stone-200 text-stone-700 hover:border-stone-400';
                  if (revealed) {
                    if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                    else if (isSelected) cls = 'border-red-400 bg-red-50 text-red-900';
                    else cls = 'border-stone-100 text-stone-400 bg-white';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selected !== null}
                      className={`w-full text-left px-4 py-3.5 rounded border font-ibm text-sm leading-snug transition-all ${cls} ${!revealed ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <span className="font-cormorant font-semibold text-base mr-2">
                        {['А', 'Б', 'В', 'Г'][i]}.
                      </span>
                      {opt}
                      {revealed && isCorrect && <span className="ml-2 text-emerald-600">✓</span>}
                      {revealed && isSelected && !isCorrect && <span className="ml-2 text-red-500">✗</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="animate-scale-in text-center py-6">
              <div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 border-4"
                style={{
                  borderColor: score === selectedBook.questions.length ? 'hsl(150, 40%, 40%)' : score >= 2 ? 'hsl(38, 70%, 52%)' : 'hsl(350, 40%, 40%)',
                  background: score === selectedBook.questions.length ? 'hsl(150, 40%, 95%)' : score >= 2 ? 'hsl(38, 70%, 95%)' : 'hsl(350, 40%, 97%)'
                }}
              >
                <span className="font-cormorant text-4xl font-bold" style={{
                  color: score === selectedBook.questions.length ? 'hsl(150, 40%, 30%)' : score >= 2 ? 'hsl(38, 60%, 35%)' : 'hsl(350, 40%, 35%)'
                }}>
                  {score}/{selectedBook.questions.length}
                </span>
              </div>

              <h2 className="font-cormorant text-3xl font-bold mb-2" style={{ color: 'hsl(350, 40%, 22%)' }}>
                {score === selectedBook.questions.length ? 'Отлично!' : score >= 2 ? 'Хорошо' : 'Нужно повторить'}
              </h2>
              <p className="font-ibm text-sm text-stone-500 mb-8">
                {score === selectedBook.questions.length
                  ? 'Вы отлично знаете это произведение!'
                  : score >= 2
                  ? 'Перечитайте краткое содержание ещё раз'
                  : 'Вернитесь к пересказу и повторите основные моменты'}
              </p>

              <div className="text-left space-y-3 mb-8">
                {selectedBook.questions.map((q, i) => {
                  const correct = answers[i] === q.correct;
                  return (
                    <div key={i} className={`p-3 rounded border ${correct ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                      <p className="font-ibm text-xs font-medium mb-1 flex items-center gap-1.5" style={{ color: correct ? 'hsl(150, 40%, 30%)' : 'hsl(350, 40%, 35%)' }}>
                        {correct ? <Icon name="Check" size={12} /> : <Icon name="X" size={12} />}
                        Вопрос {i + 1}
                      </p>
                      <p className="font-ibm text-xs text-stone-600 mb-1">{q.question}</p>
                      {!correct && (
                        <p className="font-ibm text-xs text-emerald-700">
                          Правильный ответ: {q.options[q.correct]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={startQuiz}
                  className="w-full py-3.5 rounded font-ibm font-semibold text-sm tracking-wide transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: 'hsl(350, 40%, 22%)', color: 'hsl(38, 60%, 88%)' }}
                >
                  <Icon name="RotateCcw" size={15} />
                  Пройти снова
                </button>
                <button
                  onClick={() => setView('book')}
                  className="w-full py-3.5 rounded font-ibm text-sm border border-stone-300 text-stone-700 hover:bg-stone-100 transition-all"
                >
                  Вернуться к пересказу
                </button>
                <button
                  onClick={() => { setView('catalog'); setSelectedBook(null); }}
                  className="w-full py-3.5 rounded font-ibm text-sm text-stone-500 hover:text-stone-700 transition-all"
                >
                  В каталог
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="h-10" />
    </div>
  );
}
