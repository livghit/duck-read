import React from 'react'
import { HeadingButton } from '@/components/tiptap-ui/heading-button'

export default function EditorPage() {

    return (
        <div className="editor-page">
            <div className="toolbar">
                <HeadingButton level={1}>Heading 1</HeadingButton>
                <HeadingButton level={2}>Heading 2</HeadingButton>
                <HeadingButton level={3}>Heading 3</HeadingButton>
            </div>
            {/* Your editor component */}
        </div>
    )
}
