import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import { formatMessage } from '@openimis/fe-core';
import { useIntl } from 'react-intl';

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'clean']
  ],
};

const StyledEditorWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  backgroundColor: '#ffffff',
  borderRadius: theme.shape?.borderRadius || 4,
  border: `1px solid ${theme.palette?.divider || '#ccc'}`,
  '& .quill': {
    backgroundColor: '#ffffff',
    '& .ql-toolbar': {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: theme.shape?.borderRadius || 4,
      borderTopRightRadius: theme.shape?.borderRadius || 4,
      border: 'none',
      borderBottom: `1px solid ${theme.palette?.divider || '#ccc'}`,
    },
    '& .ql-container': {
      backgroundColor: '#ffffff',
      borderBottomLeftRadius: theme.shape?.borderRadius || 4,
      borderBottomRightRadius: theme.shape?.borderRadius || 4,
      border: 'none',
      minHeight: '150px',
      fontSize: '1rem',
      fontFamily: theme.typography?.fontFamily,
      color: '#000000',
    },
    '& .ql-editor': {
      backgroundColor: '#ffffff',
      color: '#000000',
      minHeight: '150px',
    },
  },
  '& .ql-disabled': {
    backgroundColor: '#ffffff',
    '& .ql-toolbar': {
      display: 'none',
    },
    '& .ql-container': {
      borderTopLeftRadius: theme.shape?.borderRadius || 4,
      borderTopRightRadius: theme.shape?.borderRadius || 4,
      backgroundColor: '#ffffff',
    },
    '& .ql-editor': {
      backgroundColor: '#ffffff',
      color: '#000000',
    }
  }
}));

const NoticeDescriptionEditor = ({ value, onChange, readOnly, label }) => {
  const intl = useIntl();
  const quillRef = useRef(null);
  const lastValueRef = useRef(value || '');
  const initialValueRef = useRef(value || '');

  useEffect(() => {
    const normalizedValue = (!value || value === '<p><br></p>') ? '' : value;
    const normalizedLast = (!lastValueRef.current || lastValueRef.current === '<p><br></p>') ? '' : lastValueRef.current;

    if (normalizedValue !== normalizedLast) {
      lastValueRef.current = normalizedValue;
      const editor = quillRef.current?.getEditor?.();
      if (editor) {
        const currentHTML = editor.root.innerHTML;
        const normalizedCurrent = currentHTML === '<p><br></p>' ? '' : currentHTML;
        if (normalizedCurrent !== normalizedValue) {
          if (!normalizedValue) {
            editor.setText('');
          } else {
            editor.clipboard.dangerouslyPasteHTML(normalizedValue, 'silent');
          }
        }
      }
    }
  }, [value]);

  const handleChange = (content, delta, source) => {
    if (source === 'user') {
      const isEmpty = !content || content === '<p><br></p>';
      const cleanContent = isEmpty ? '' : content;
      lastValueRef.current = cleanContent;
      if (onChange) {
        onChange(cleanContent);
      }
    }
  };

  return (
    <StyledEditorWrapper>
      {label && (
        <Typography variant="caption" color="textSecondary">
          {formatMessage(intl, "notice", label)}
        </Typography>
      )}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        defaultValue={initialValueRef.current}
        onChange={handleChange}
        readOnly={readOnly}
        modules={QUILL_MODULES}
      />
    </StyledEditorWrapper>
  );
};

export default NoticeDescriptionEditor;
