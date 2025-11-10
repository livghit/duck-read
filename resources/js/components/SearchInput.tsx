import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import React from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    placeholder?: string;
    isLoading?: boolean;
    className?: string;
}

export default function SearchInput({
    value,
    onChange,
    onSearch,
    placeholder = 'Search books...',
    isLoading = false,
    className,
}: SearchInputProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className={cn('flex w-full gap-2', className)}>
            <div className="relative flex-1">
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={isLoading}
                    className="pr-10"
                />
                {value && (
                    <button
                        onClick={() => onChange('')}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        type="button"
                        disabled={isLoading}
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>
            <Button
                onClick={onSearch}
                disabled={isLoading || !value.trim()}
                size="default"
            >
                <Search className="size-4" />
                {isLoading ? 'Searching...' : 'Search'}
            </Button>
        </div>
    );
}
