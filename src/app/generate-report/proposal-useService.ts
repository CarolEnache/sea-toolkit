import { useState, useEffect, useTransition } from "react";

type Method = 'GET' | 'POST';

interface UseServiceOptions {
  method?: Method;
}

interface UseServiceReturn<T, V> {
  data?: T;
  error?: Error;
  pending: boolean;
  revalidate?: (params?: V) => void;
  mutate?: (params?: V) => void;
}

export function useService<T, V = void>(
  serverAction: (params?: V) => Promise<T>,
  options: UseServiceOptions = { method: 'GET' }
): UseServiceReturn<T, V> {
  const { method = 'GET' } = options;
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();
  const [pending, startTransition] = useTransition();

  const performCall = (params?: V) => {
    startTransition(() => {
      serverAction(params)
        .then(setData)
        .catch(setError);
    });
  };

  useEffect(() => {
    if (method === 'GET') {
      performCall();
    }
  }, []);

  return method === 'GET'
    ? { data, error, pending, revalidate: performCall }
    : { data, error, pending, mutate: performCall };
}

/** GET example *//*
const books = useService<Book[]>(getBooks);

if (books.pending) {
  return <div>Loading...</div>;
} else if (books.error) {
  return <div>Error: {books.error.message}</div>;
} else if (!books.data) {
  return <div>Something went wrong</div>;
}

return <div>
  {books.data && <div>{book.data.title}. {book.data.stock} in stock.</div>}

  <button onClick={books.revalidate}>Refresh</button>
</div>;
*/

/** POST example *//*
const books = useService<{ updated: boolean }, Book>(saveBook, { method: 'POST' });

const handleSubmit = () => {
  books.mutate({ example: "data" });
};

return <div>
  <button onClick={handleSubmit}>Save book</button>

  {books.pending && <div>Saving book...</div>}
  {books.error?.message && <div>Error saving book: {book.error.message}</div>}
  {books.data?.updated ? <div>Book updated</div> : <div>Something went wrong</div>}
</div>;
*/

/** When using both *//*
const bookService = {
  books: useService<Book[]>(getBooks),
  save: useService<{ updated: boolean }, Book>(saveBook, { method: 'POST' }),
};

useEffect(() => {
  if (bookService.save.data?.updated) {
    bookService.books.revalidate();
  }
}, [bookService.save.data]);

const handleSubmit = () => {
  bookService.save.mutate({ example: "data" });
};
*/