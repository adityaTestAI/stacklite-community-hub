
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bold, Italic, Underline, Code, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from 'lucide-react';
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  className,
  minHeight = "200px"
}) => {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const handleBold = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
    onChange(newText);
    
    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, end + 2);
    }, 0);
  };

  const handleItalic = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 1, end + 1);
    }, 0);
  };

  const handleUnderline = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + `<u>${selectedText}</u>` + value.substring(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 3, end + 3);
    }, 0);
  };

  const handleCode = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // If multiple lines, use code block ```
    if (selectedText.includes('\n')) {
      const newText = value.substring(0, start) + 
        '\n```\n' + selectedText + '\n```\n' + 
        value.substring(end);
      onChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 5, start + 5 + selectedText.length);
      }, 0);
    } else {
      // Inline code
      const newText = value.substring(0, start) + '`' + selectedText + '`' + value.substring(end);
      onChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 1, end + 1);
      }, 0);
    }
  };

  const handleBulletList = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // Check if we have multiple lines
    if (selectedText.includes('\n')) {
      const lines = selectedText.split('\n');
      const bulletedLines = lines.map(line => line.trim() ? `- ${line}` : line).join('\n');
      const newText = value.substring(0, start) + bulletedLines + value.substring(end);
      onChange(newText);
    } else {
      const newText = value.substring(0, start) + `- ${selectedText}` + value.substring(end);
      onChange(newText);
    }
    
    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  const handleNumberedList = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // Check if we have multiple lines
    if (selectedText.includes('\n')) {
      const lines = selectedText.split('\n');
      let numberedLines = '';
      let counter = 1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim()) {
          numberedLines += `${counter}. ${lines[i]}\n`;
          counter++;
        } else {
          numberedLines += lines[i] + '\n';
        }
      }
      
      const newText = value.substring(0, start) + numberedLines.trimEnd() + value.substring(end);
      onChange(newText);
    } else {
      const newText = value.substring(0, start) + `1. ${selectedText}` + value.substring(end);
      onChange(newText);
    }
    
    setTimeout(() => {
      textarea.focus();
    }, 0);
  };

  // Simple Markdown to HTML conversion for preview
  const renderPreview = () => {
    if (!value) return <p className="text-muted-foreground italic">No content to preview</p>;
    
    let html = value
      // Handle bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Handle italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Handle code blocks
      .replace(/```(.+?)```/gs, '<pre><code>$1</code></pre>')
      // Handle inline code
      .replace(/`(.*?)`/g, '<code class="bg-secondary text-primary px-1 rounded">$1</code>')
      // Handle bullet lists
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      // Handle numbered lists
      .replace(/^\d+\. (.*)$/gm, '<li>$1</li>')
      // Handle paragraphs
      .split('\n\n').join('</p><p>');
    
    // Wrap in paragraph if not already
    if (!html.startsWith('<p>')) {
      html = '<p>' + html + '</p>';
    }
    
    // Convert bullet list items to proper lists
    html = html.replace(/<li>.*?<\/li>/gs, match => {
      if (match.startsWith('<li>- ')) {
        return '<ul>' + match + '</ul>';
      }
      return match;
    });
    
    return <div dangerouslySetInnerHTML={{ __html: html }} className="prose dark:prose-invert max-w-none" />;
  };

  return (
    <div className={cn("border rounded-md", className)}>
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "write" | "preview")}>
        <div className="flex items-center justify-between border-b p-2">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          {activeTab === "write" && (
            <div className="flex items-center space-x-1">
              <Button type="button" variant="ghost" size="icon" onClick={handleBold} title="Bold">
                <Bold className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={handleItalic} title="Italic">
                <Italic className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={handleUnderline} title="Underline">
                <Underline className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={handleCode} title="Code">
                <Code className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={handleBulletList} title="Bullet List">
                <List className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={handleNumberedList} title="Numbered List">
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="write" className="p-0 focus-visible:outline-none focus-visible:ring-0">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "w-full p-4 resize-y focus-visible:outline-none bg-transparent",
              "min-h-[200px]",
              minHeight && `min-h-[${minHeight}]`
            )}
            style={{ minHeight }}
            placeholder="Write your content here using Markdown formatting..."
          />
        </TabsContent>
        
        <TabsContent value="preview" className="p-4 min-h-[200px] focus-visible:outline-none focus-visible:ring-0">
          {renderPreview()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RichTextEditor;
