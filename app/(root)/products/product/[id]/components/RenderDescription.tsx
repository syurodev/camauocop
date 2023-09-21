import React from "react";
import { sanitize } from "isomorphic-dompurify";

type IDescription = {
  description:
    | {
        time: number;
        blocks: any[];
        version: string;
      }
    | undefined;
};

const RenderDescription: React.FC<IDescription> = ({ description }) => {
  const elements = description?.blocks.map((block, index) => {
    switch (block.type) {
      case "header":
        const sanitizedText = sanitize(block.data.text);
        const HeadingTag =
          `h${block.data.level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            key={index}
            dangerouslySetInnerHTML={{ __html: sanitizedText }}
          />
        );
      case "paragraph":
        const sanitizedParagraph = sanitize(block.data.text);
        return (
          <p
            key={index}
            dangerouslySetInnerHTML={{ __html: sanitizedParagraph }}
          />
        );
      case "delimiter":
        return <hr key={index} />;
      case "list":
        return (
          <ul key={index}>
            {block.data.items.map((li: string, liIndex: number) => (
              <li
                key={liIndex}
                dangerouslySetInnerHTML={{ __html: sanitize(li) }}
              />
            ))}
          </ul>
        );
      case "checklist":
        return (
          <ul key={index}>
            {block.data.items.map(
              (item: { text: string; checked: boolean }, itemIndex: number) => (
                <li key={itemIndex}>
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    disabled={true}
                  />
                  {sanitize(item.text)}
                </li>
              )
            )}
          </ul>
        );
      default:
        console.log("Unknown block type", block.type);
        console.log(block);
        return null;
    }
  });

  return <div>{elements}</div>;
};

export default RenderDescription;
