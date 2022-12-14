import { BeforeMount } from '@monaco-editor/react';
import { lazy, Suspense } from 'react';


interface EditorProps {
  value: string;
  onChange: (val?: string) => void;
}
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

export const Editor: React.FC<EditorProps> = (props) => {
  const { value, onChange } = props;

  const onBeforeMount: BeforeMount = () => {
    // monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    //   validate: true,
    //   schemas: []
    // })
  };

  return (
    <Suspense fallback={<>Editor Loading...</>}>
      <MonacoEditor
        value={value}
        height="350px"
        onChange={onChange}
        language="json"
        options={{
          scrollBeyondLastLine: false,
          minimap: {
            enabled: false
          }
        }}
        beforeMount={onBeforeMount}
      />
    </Suspense>
  );
};