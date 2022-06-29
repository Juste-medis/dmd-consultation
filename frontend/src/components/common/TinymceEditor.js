import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';
import AppContext from 'context/Context';
import { getColor } from 'helpers/utils';

const TinymceEditor = ({ value, handleChange }) => {
  const {
    config: { isDark, isRTL }
  } = useContext(AppContext);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.dom.addStyle(
        `body{color: ${getColor('white')} !important;}`
      );
    }
  }, [isDark]);

  return (
    <Editor
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={handleChange}
      apiKey="i9ly643n5noy3yxw84fa9tn2rn2pulwjt6dfi7ryor6winxq"
      init={{
        height: '50vh',
        menubar: false,
        content_style: `body { color: ${getColor('black')} }`,
        mobile: {
          theme: 'mobile',
          toolbar: ['styleselect | bold italic bullist numlist image undo redo']
        },
        statusbar: false,
        plugins: 'image lists directionality',
        toolbar: 'styleselect | bold italic bullist numlist image undo redo',
        directionality: isRTL ? 'rtl' : 'ltr',
        theme_advanced_toolbar_align: 'center',
        style_formats: [
          {
            title: 'Titres',
            items: [
              { title: 'Titre 1', format: 'h3' },
              { title: 'Titre 2', format: 'h4' },
              { title: 'Titre 3', format: 'h5' },
              { title: 'Titre 4', format: 'h6' }
            ]
          },
          {
            title: 'Inline',
            items: [
              { title: 'Bold', format: 'bold' },
              { title: 'Italic', format: 'italic' },
              { title: 'Underline', format: 'underline' },
              { title: 'Strikethrough', format: 'strikethrough' },
              { title: 'Superscript', format: 'superscript' },
              { title: 'Subscript', format: 'subscript' },
              { title: 'Code', format: 'code' }
            ]
          },
          {
            title: 'Blocks',
            items: [
              { title: 'Paragraph', format: 'p' },
              { title: 'Blockquote', format: 'blockquote' },
              { title: 'Div', format: 'div' },
              { title: 'Pre', format: 'pre' }
            ]
          },
          {
            title: 'Align',
            items: [
              { title: 'Left', format: 'alignleft' },
              { title: 'Center', format: 'aligncenter' },
              { title: 'Right', format: 'alignright' },
              { title: 'Justify', format: 'alignjustify' }
            ]
          }
        ]
      }}
    />
  );
};

TinymceEditor.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func
};

export default TinymceEditor;
