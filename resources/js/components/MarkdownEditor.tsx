import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

interface MarkdownEditorProps {
    id?: string;
    name?: string;
    value: string;
    placeholder?: string;
    minLength?: number;
    onChange: (value: string) => void;
    error?: string;
}

export default function MarkdownEditor({
    id,
    name,
    value,
    placeholder,
    minLength = 10,
    onChange,
    error,
}: MarkdownEditorProps) {
    const [preview, setPreview] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const applyWrap = (prefix: string, suffix: string = prefix) => {
        const el = textareaRef.current;
        if (!el) return;
        const start = el.selectionStart ?? 0;
        const end = el.selectionEnd ?? 0;
        const before = value.slice(0, start);
        const selected = value.slice(start, end);
        const after = value.slice(end);

        const next = `${before}${prefix}${selected || 'your text'}${suffix}${after}`;
        onChange(next);

        const cursorPos =
            start +
            prefix.length +
            (selected ? selected.length : 'your text'.length);
        window.requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(cursorPos, cursorPos);
        });
    };

    const applyLinePrefix = (prefix: string) => {
        const el = textareaRef.current;
        if (!el) return;
        const start = el.selectionStart ?? 0;
        const end = el.selectionEnd ?? 0;

        // Expand selection to full lines
        const beforeText = value.slice(0, start);
        const afterText = value.slice(end);
        const selectionText = value.slice(start, end);

        const lineStart = beforeText.lastIndexOf('\n') + 1;
        const lineEndRel = selectionText.indexOf('\n');
        const expandedEnd =
            end + (lineEndRel === -1 ? 0 : selectionText.length - lineEndRel);

        const expanded = value.slice(lineStart, expandedEnd || end);
        const lines = expanded.split('\n');
        const updated = lines
            .map((l) => (l.startsWith(prefix) ? l : `${prefix}${l}`))
            .join('\n');

        const next = `${value.slice(0, lineStart)}${updated}${value.slice(expandedEnd || end)}`;
        onChange(next);

        const newStart = lineStart;
        window.requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(newStart, newStart + updated.length);
        });
    };

    const applyHeading = (level: 1 | 2 | 3) => {
        const hashes = '#'.repeat(level) + ' ';
        applyLinePrefix(hashes);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const isMod = e.metaKey || e.ctrlKey;
        if (!isMod) return;

        if (e.key.toLowerCase() === 'b') {
            e.preventDefault();
            applyWrap('**');
        } else if (e.key.toLowerCase() === 'i') {
            e.preventDefault();
            applyWrap('*');
        }
    };

    const words = (value.trim().match(/\S+/g) || []).length;
    const chars = value.length;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyWrap('**')}
                    >
                        Bold
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyWrap('*')}
                    >
                        Italic
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyWrap('`')}
                    >
                        Code
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            const url =
                                window.prompt('Enter URL') || 'https://';
                            const el = textareaRef.current;
                            const start = el?.selectionStart ?? 0;
                            const end = el?.selectionEnd ?? 0;
                            const selected =
                                value.slice(start, end) || 'link text';
                            const before = value.slice(0, start);
                            const after = value.slice(end);
                            const next = `${before}[${selected}](${url})${after}`;
                            onChange(next);
                            window.requestAnimationFrame(() => {
                                el?.focus();
                            });
                        }}
                    >
                        Link
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyHeading(1)}
                    >
                        H1
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyHeading(2)}
                    >
                        H2
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyHeading(3)}
                    >
                        H3
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyLinePrefix('- ')}
                    >
                        • List
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyLinePrefix('1. ')}
                    >
                        1. List
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyLinePrefix('> ')}
                    >
                        Quote
                    </Button>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                        {words} {words === 1 ? 'word' : 'words'} • {chars}{' '}
                        {chars === 1 ? 'char' : 'chars'}
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPreview((p) => !p)}
                    >
                        {preview ? 'Edit' : 'Preview'}
                    </Button>
                </div>
            </div>

            {preview ? (
                <Card>
                    <CardContent className="pt-6">
                        {value ? (
                            <MarkdownRenderer content={value} />
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                Your review preview will appear here...
                            </p>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Textarea
                    id={id}
                    name={name}
                    ref={textareaRef}
                    value={value}
                    onKeyDown={onKeyDown}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="min-h-[300px] font-mono text-sm"
                />
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <p className="text-xs text-muted-foreground">
                Supports markdown: <strong>**bold**</strong>, <em>*italic*</em>,{' '}
                <code>code</code>, links, lists, and headings. Minimum{' '}
                {minLength} characters.
            </p>
        </div>
    );
}
