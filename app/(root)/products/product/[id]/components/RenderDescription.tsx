import React from "react";

type IDescription = {
  description:
  | {
    type: string;
    content: any[];
  }
  | undefined;
};

interface TextContent {
  type: 'text' | "paragraph";
  text: string;
  marks?: {
    type: string;
  }[];
}

interface ParagraphContent {
  content: {
    type: 'paragraph';
    text: string;
    marks?: {
      type: string;
    }
  }[]
}

interface HeadingContent {
  type: 'heading';
  attrs: {
    textAlign: string;
    level: number;
  };
  content: TextContent[];
  marks?: {
    type: string;
  }[];
}

// Component để biểu diễn một đoạn văn bản
const TextComponent: React.FC<{ content: TextContent }> = ({ content }) => {
  const classNames = [
    content.marks?.some(mark => mark.type === 'bold') ? 'font-bold' : 'font-normal',
    content.marks?.some(mark => mark.type === 'italic') ? 'italic' : 'not-italic',
  ].join(' ');

  return <span className={classNames}>{content.text}</span>;
};

// Component để biểu diễn một đoạn văn bản với thuộc tính textAlign
const ParagraphComponent: React.FC<ParagraphContent> = ({ content }) => {
  if (content && content.length > 0) {
    return (
      <p>
        {
          content.map((item, index: number) => {
            return <TextComponent key={index} content={item as TextContent} />
          })

        }
      </p>
    )
  } else {
    return ""
  }
};

// Component để biểu diễn một tiêu đề với thuộc tính textAlign và marks
const HeadingComponent: React.FC<{ content: HeadingContent }> = ({ content }) => {
  const textAlignClass = content.attrs?.textAlign === 'right' ? 'text-right' : content.attrs?.textAlign === 'center' ? 'text-center' : 'text-left';

  let headingClass = '';

  switch (content.attrs?.level) {
    case 1:
      headingClass = 'text-4xl'; // Tuỳ chỉnh kích thước tiêu đề
      break;
    case 2:
      headingClass = 'text-3xl'; // Tuỳ chỉnh kích thước tiêu đề
      break;
    case 3:
      headingClass = 'text-2xl'; // Tuỳ chỉnh kích thước tiêu đề
      break;
    default:
      headingClass = 'text-xl'; // Tuỳ chỉnh kích thước tiêu đề mặc định
  }

  const fontWeightClass = content.content[0].marks?.some(mark => mark.type === 'bold') ? 'font-bold' : 'font-normal';
  const fontStyleClass = content.content[0].marks?.some(mark => mark.type === 'italic') ? 'italic' : 'not-italic';

  return (
    <h1 className={`${textAlignClass} ${fontWeightClass} ${headingClass}`}>
      <span className={fontStyleClass}>{content.content[0].text}</span>
    </h1>
  );
};


const RenderDescription: React.FC<IDescription> = ({ description }) => {
  return (
    <div>
      {description && description?.content && description?.content.length > 0 && description?.content.map((item: any, index: number) => {
        switch (item.type) {
          case 'paragraph':
            return <ParagraphComponent key={index} content={item.content} />;
          case 'heading':
            return <HeadingComponent key={index} content={item} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default React.memo(RenderDescription);
