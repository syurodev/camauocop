import React, { useMemo } from "react";
import { generateHTML } from '@tiptap/html'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import HardBreak from '@tiptap/extension-hard-break'

type IDescription = {
  description:
  | {
    type: string;
    content: any[];
  }
  | undefined;
};

const RenderDescription: React.FC<IDescription> = ({ description }) => {
  const output = useMemo(() => {
    if (description) {
      return generateHTML(description, [
        Document,
        Paragraph,
        Text,
        Bold,
        Italic,
        Heading,
        OrderedList,
        BulletList,
        ListItem,
        HardBreak
        // other extensions …
      ])
    }
  }, [description])

  return (
    <div dangerouslySetInnerHTML={{ __html: output || '' }} />
  );
};

export default React.memo(RenderDescription);
