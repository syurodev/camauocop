'use client'

import React from 'react';
import { IAddProductZodSchema } from '@/lib/zodSchema/products';
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { UseFormGetValues } from 'react-hook-form';
import Heading from '@tiptap/extension-heading'
import { Button, Card, CardBody } from '@nextui-org/react';

interface EditorProps {
  setValue: (
    name:
      | "shopId"
      | "productType"
      | "name"
      | "description"
      | "quantity"
      | "images"
      | "retailPrice"
      | "retail"
      | "packageOptions",
    value: any,
    options?: any
  ) => void;
  getValues: UseFormGetValues<IAddProductZodSchema>
}

const Tiptap: React.FC<EditorProps> = ({ getValues, setValue }) => {
  const [isEditable, setIsEditable] = React.useState(true)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose bg-[#f4f4f5] dark:bg-[#27272b] w-full max-h-[500px] min-h-[300px] overflow-scroll rounded-lg dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none p-2',
      },
    },
    content: '<p>Mô tả sản phẩm</p>',
    onUpdate: () => {
      setValue(
        "description", editor?.getJSON()
      );
    }
  })

  React.useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable)
    }
  }, [isEditable, editor])

  return (
    <>
      {
        editor && <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <Card shadow='sm' className='flex flex-col gap-2 justify-end'>
            <CardBody>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''} border-none`}
              >
                H1
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} border-none`}
              >
                H2
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''} border-none`}
              >
                H3
              </Button>
            </CardBody>
          </Card>
        </FloatingMenu>
      }

      {
        editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <Button
            variant='faded'
            size='sm'
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            bold
          </Button>
          <Button
            variant='faded'
            size='sm'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            italic
          </Button>
        </BubbleMenu>
      }
      <EditorContent editor={editor} />
    </>
  )
}

export default Tiptap