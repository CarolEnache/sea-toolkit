import type {
  Dispatch,
  SetStateAction,
} from 'react';
import React, {
  createContext,
  useContext,
  useState,
} from 'react';

type GenerateReportContextType = {
  reportId: string;
  setReportId: Dispatch<SetStateAction<string>>;
};

const GenerateReportContext = createContext<GenerateReportContextType>({
  reportId: '',
  setReportId: () => '',
});

export function GenerateReportContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reportId, setReportId] = useState('');

  return (
    <GenerateReportContext.Provider value={{ reportId, setReportId }}>
      {children}
    </GenerateReportContext.Provider>
  );
}

export function useGenerateReportContext() {
  return useContext(GenerateReportContext);
}
