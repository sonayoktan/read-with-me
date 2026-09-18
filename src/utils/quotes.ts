import type { Quote } from '../types';

export const readingQuotes: Quote[] = [
  {
    text: "Kitaplar, ruhun yaralarını saran en şefkatli ellerdir.",
    author: "Virginia Woolf"
  },
  {
    text: "Bir fincan kahve, iyi bir kitap ve sessizlik; dünyanın en büyük lüksü.",
    author: "Haruki Murakami"
  },
  {
    text: "Okumak, insanın kendi içine doğru yaptığı en huzurlu yolculuktur.",
    author: "Sabahattin Ali",
    book: "Kürk Mantolu Madonna"
  },
  {
    text: "Cenneti hep bir kütüphane şeklinde düşlemişimdir.",
    author: "Jorge Luis Borges"
  },
  {
    text: "Kitaplar olmasaydı, hayat katlanılamaz bir yalnızlık olurdu.",
    author: "Franz Kafka"
  },
  {
    text: "Kitap bir limandı benim için. Kitaplarda kendimi aradım.",
    author: "Cemil Meriç"
  },
  {
    text: "İyi bir kitap, insanın içinde donmuş denizi kıran bir baltadır.",
    author: "Franz Kafka"
  },
  {
    text: "Günde birkaç sayfa bile olsa okumak, zihni dinlendirmenin en derin yoludur.",
    author: "Anonim"
  }
];

export const getRandomQuote = (): Quote => {
  const index = Math.floor(Math.random() * readingQuotes.length);
  return readingQuotes[index];
};
