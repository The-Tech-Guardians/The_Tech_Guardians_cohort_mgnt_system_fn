"use client";

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, Link, Code, Quote, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface FormattedTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  minHeight?: string;
  showToolbar?: boolean;
}

export default function FormattedTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start typing...", 
  editable = true,
  className = "",
  minHeight = "200px",
  showToolbar = true
}: FormattedTextEditorProps) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isList, setIsList] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url && editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const link = document.createElement('a');
        link.href = url;
        link.textContent = url || 'Link';
        link.className = 'text-blue-600 underline hover:text-blue-800';
        range.insertNode(link);
      }
    }
    handleContentChange();
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    title, 
    children 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    title: string; 
    children: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => (
    <div className="w-px h-6 bg-gray-300" />
  );

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      {editable && showToolbar && (
        <div className="border-b border-gray-200 bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => {
                setIsBold(!isBold);
                applyFormat('bold');
              }}
              isActive={isBold}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                setIsItalic(!isItalic);
                applyFormat('italic');
              }}
              isActive={isItalic}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                setIsUnderline(!isUnderline);
                applyFormat('underline');
              }}
              isActive={isUnderline}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </ToolbarButton>
          </div>
          
          <ToolbarDivider />
          
          {/* Lists */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => {
                setIsList(!isList);
                applyFormat('insertUnorderedList');
              }}
              isActive={isList}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
          </div>
          
          <ToolbarDivider />
          
          {/* Alignment */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => {
                setTextAlign('left');
                applyFormat('justifyLeft');
              }}
              isActive={textAlign === 'left'}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                setTextAlign('center');
                applyFormat('justifyCenter');
              }}
              isActive={textAlign === 'center'}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                setTextAlign('right');
                applyFormat('justifyRight');
              }}
              isActive={textAlign === 'right'}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </ToolbarButton>
          </div>
          
          <ToolbarDivider />
          
          {/* Insert */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={insertLink}
              title="Add Link"
            >
              <Link className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>
      )}
      
      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable={editable}
        className={`min-h-[${minHeight}] p-4 focus:outline-none prose prose-sm max-w-none ${
          editable ? 'cursor-text' : ''
        }`}
        style={{ minHeight }}
        onInput={handleContentChange}
        onKeyUp={handleContentChange}
        onMouseUp={handleContentChange}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: '' }}
      />
      
      {/* Hidden input for placeholder */}
      {editable && content === '' && (
        <div 
          className="absolute top-4 left-4 text-gray-400 pointer-events-none"
          contentEditable={false}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
}
