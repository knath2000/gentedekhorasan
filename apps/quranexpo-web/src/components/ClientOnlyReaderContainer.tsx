import ReaderContainer from './ReaderContainer';

interface ClientOnlyReaderContainerProps {
  surahId: number;
}

const ClientOnlyReaderContainer = ({ surahId }: ClientOnlyReaderContainerProps) => {
  // Siempre renderiza ReaderContainer, que manejará su propio estado de carga y esqueleto
  return <ReaderContainer surahId={surahId} />;
};

export default ClientOnlyReaderContainer;