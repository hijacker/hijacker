import { BeforeMount } from '@monaco-editor/react';
import { lazy, Suspense, useEffect, useState } from 'react';


interface EditorProps {
  value: string;
  onChange: (val?: string) => void;
}
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

export const Editor: React.FC<EditorProps> = (props) => {
  const { value, onChange } = props;

  const onBeforeMount: BeforeMount = (monaco) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: '',
          fileMatch: ['*'],
          schema: {
            type: 'object',
            properties: {
              test: {
                type: 'string'
              }
            },
            additionalProperties: false
          }
        }
      ]
    })
  }

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
  )
}