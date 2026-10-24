import { useState } from 'react';

type Mode = 'none' | 'link' | 'file';

type Props = {
    resumeUrl: string;
    onResumeUrlChange: (url: string) => void;
    onFileChange: (file: File | null) => void;
    fileName?: string | null;
    fileUrl?: string | null;
    errorUrl?: string;
    errorFile?: string;
};

export default function ResumePicker({
    resumeUrl,
    onResumeUrlChange,
    onFileChange,
    fileName,
    fileUrl,
    errorUrl,
    errorFile,
}: Props) {
    const [mode, setMode] = useState<Mode>(
        resumeUrl ? 'link' : fileName ? 'file' : 'none',
    );

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => {
                        setMode('link');
                        onFileChange(null);
                    }}
                    className={`rounded-md px-3 py-2 text-sm ${
                        mode === 'link'
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-300 bg-white text-slate-700'
                    }`}
                >
                    Ссылка Google Docs
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setMode('file');
                        onResumeUrlChange('');
                    }}
                    className={`rounded-md px-3 py-2 text-sm ${
                        mode === 'file'
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-300 bg-white text-slate-700'
                    }`}
                >
                    Загрузить файлом
                </button>
                {mode !== 'none' && (
                    <button
                        type="button"
                        onClick={() => {
                            setMode('none');
                            onResumeUrlChange('');
                            onFileChange(null);
                        }}
                        className="rounded-md px-3 py-2 text-sm text-slate-500 underline"
                    >
                        Убрать
                    </button>
                )}
            </div>

            {mode === 'link' && (
                <div>
                    <input
                        type="url"
                        value={resumeUrl}
                        onChange={(e) => onResumeUrlChange(e.target.value)}
                        placeholder="https://docs.google.com/..."
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                    {errorUrl && <p className="mt-1 text-sm text-red-600">{errorUrl}</p>}
                </div>
            )}

            {mode === 'file' && (
                <div>
                    <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                        className="block w-full text-sm"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                        PDF, PNG, JPG · до 10 МБ. DOC/DOCX — только ссылкой (Google Docs).
                    </p>
                    {fileName && (
                        <p className="mt-1 text-sm text-slate-600">
                            Сейчас:{' '}
                            {fileUrl ? (
                                <a href={fileUrl} className="underline">
                                    {fileName}
                                </a>
                            ) : (
                                fileName
                            )}
                        </p>
                    )}
                    {errorFile && <p className="mt-1 text-sm text-red-600">{errorFile}</p>}
                </div>
            )}
        </div>
    );
}
