import React, {
  createContext,
  useState,
  useContext,
  SetStateAction,
  Dispatch,
} from "react";

type GenerateReportContextType = {
  reportId: string;
  setReportId: Dispatch<SetStateAction<string>>;
};

const GenerateReportContext = createContext<GenerateReportContextType>({
  reportId: "",
  setReportId: () => "",
});

export const GenerateReportContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [reportId, setReportId] = useState("");

  return (
    <GenerateReportContext.Provider value={{ reportId, setReportId }}>
      {children}
    </GenerateReportContext.Provider>
  );
};

export const useGenerateReportContext = () => {
  return useContext(GenerateReportContext);
};
