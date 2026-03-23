"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Underline, List, ListItem, BulletList, Link } from '@tiptap/extension-bold';
import { useCallback } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export default function TiptapEditor({ 
  content, 
  onChange, 
  placeholder = "Start typing...", 
  editable = true,
  className = "" 
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      List,
      ListItem,
      BulletList,
      Link,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      {editable && (
        <div className="border-b border-gray-200 p-2 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('bold') ? 'bg-gray-200' : ''
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('italic') ? 'bg-gray-200' : ''
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('underline') ? 'bg-gray-200' : ''
            }`}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('bulletList') ? 'bg-gray-200' : ''
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('orderedList') ? 'bg-gray-200' : ''
            }`}
            title="Ordered List"
          >
            <List className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('link') ? 'bg-gray-200' : ''
            }`}
            title="Add Link"
          >
            <Link className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Editor Content */}
      <EditorContent 
        editor={editor}
        placeholder={placeholder}
        className="min-h-[150px] p-4 focus:outline-none"
      />
    </div>
  );
}
